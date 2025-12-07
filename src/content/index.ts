import type { DetectedIssue } from '../utils/detectors/types';
import type { IssuesDetectedMessage } from '../types/messages';

console.log('[Prompt Wrangler] Content script (isolated world) loaded');

// Listen for issues detected by the injected script
window.addEventListener('prompt-wrangler-issues', (event: Event) => {
  const customEvent = event as CustomEvent<{ issues: DetectedIssue[] }>;
  const { issues } = customEvent.detail;

  console.log('[Prompt Wrangler] Received issues from injected script:', issues);

  void (async () => {
    try {
      // Send to service worker - it will handle storage
      const message: IssuesDetectedMessage = {
        type: 'ISSUES_DETECTED',
        issues,
      };
      await chrome.runtime.sendMessage(message);
      console.log('[Prompt Wrangler] Sent issues to service worker');
    } catch (error) {
      console.error('[Prompt Wrangler] Error sending issues to service worker:', error);
    }
  })();
});

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; enabled?: boolean; dataTypes?: Record<string, boolean> },
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: unknown) => void
  ) => {
    if (message.type === 'TOGGLE_PROTECTED_MODE') {
      console.log('[Prompt Wrangler] Protected mode toggled:', message.enabled);

      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-mode-change', {
          detail: { enabled: message.enabled },
        })
      );
    }

    if (message.type === 'UPDATE_DATA_TYPES') {
      console.log('[Prompt Wrangler] Data types updated:', message.dataTypes);

      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-data-types-change', {
          detail: { dataTypes: message.dataTypes },
        })
      );
    }
  }
);
