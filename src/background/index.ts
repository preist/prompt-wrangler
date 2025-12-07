import type { Message } from '../types/messages';

interface StoredIssue {
  id: string;
  type: string;
  value: string;
  timestamp: number;
  batchId: string;
}

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
