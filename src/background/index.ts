import type { Message } from '@shared/messages';

interface StoredIssue {
  id: string;
  type: string;
  value: string;
  timestamp: number;
  batchId: string;
}

async function updateIcon() {
  try {
    const result = await chrome.storage.local.get([
      'settings.protectedMode',
      'issues.latestBatch',
      'issues.history',
    ]);

    const protectedMode = result['settings.protectedMode'] as boolean | undefined;
    const latestBatch = result['issues.latestBatch'] as string | null | undefined;
    const history = (result['issues.history'] as StoredIssue[] | undefined) ?? [];

    const hasActiveIssues =
      latestBatch !== null &&
      latestBatch !== undefined &&
      history.some((issue) => issue.batchId === latestBatch);

    let iconPath: { 16: string; 32: string };

    if (protectedMode === false) {
      iconPath = {
        16: 'icons/icon-16-off.png',
        32: 'icons/icon-32-off.png',
      };
    } else if (hasActiveIssues) {
      iconPath = {
        16: 'icons/icon-16-alert.png',
        32: 'icons/icon-32-alert.png',
      };
    } else {
      iconPath = {
        16: 'icons/icon-16.png',
        32: 'icons/icon-32.png',
      };
    }

    await chrome.action.setIcon({ path: iconPath });
    console.log('[Prompt Wrangler] Icon updated:', iconPath);
  } catch (error) {
    console.error('[Prompt Wrangler] Failed to update icon:', error);
  }
}

// Listen for storage changes to update icon
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    const relevantKeys = ['settings.protectedMode', 'issues.latestBatch', 'issues.history'];
    const hasRelevantChanges = relevantKeys.some((key) => key in changes);

    if (hasRelevantChanges) {
      void updateIcon();
    }
  }
});

// Update icon on extension startup
void updateIcon();

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, _sendResponse: (response?: unknown) => void) => {
    if (message.type === 'ISSUES_DETECTED') {
      console.log('[Prompt Wrangler] Background received issues:', message.issues);

      void (async () => {
        try {
          // Create batch ID
          const now = Date.now();
          const random = Math.random().toString(36).substring(2, 9);
          const batchId = `batch-${now.toString()}-${random}`;

          // Add batchId to issues
          const issuesWithBatch: StoredIssue[] = message.issues.map((issue) => ({
            ...issue,
            batchId,
          }));

          // Get existing history
          const result = await chrome.storage.local.get(['issues.history']);
          const existingHistory = (result['issues.history'] as StoredIssue[] | undefined) ?? [];

          // Prepend new issues
          const updatedHistory = [...issuesWithBatch, ...existingHistory];

          // Store back
          await chrome.storage.local.set({
            'issues.latestBatch': batchId,
            'issues.history': updatedHistory,
          });

          console.log('[Prompt Wrangler] Stored issues in chrome.storage');

          // Update icon to show alert
          void updateIcon();

          // Try to notify popup if it's open (don't wait for response)
          chrome.runtime.sendMessage(
            {
              type: 'NEW_ISSUES',
              issues: message.issues,
            },
            () => {
              // Ignore errors if popup isn't open
              if (chrome.runtime.lastError) {
                console.log('[Prompt Wrangler] Popup not open, issues stored for later');
              }
            }
          );
        } catch (error) {
          console.error('[Prompt Wrangler] Failed to store issues:', error);
        }
      })();

      return false;
    }

    return false;
  }
);
