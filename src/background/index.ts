import { addDetectedIssues, cleanupExpiredDismissals } from '../utils/storage';
import type { Message, IssuesStoredMessage } from '../types/messages';

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse: (response: IssuesStoredMessage) => void) => {
    if (message.type === 'ISSUES_DETECTED') {
      void (async () => {
        try {
          await addDetectedIssues(message.issues);
          sendResponse({ type: 'ISSUES_STORED', success: true });
        } catch (error) {
          console.error('[Prompt Wrangler] Failed to store issues:', error);
          sendResponse({ type: 'ISSUES_STORED', success: false });
        }
      })();

      return true;
    }

    return false;
  }
);

chrome.runtime.onInstalled.addListener(() => {
  void cleanupExpiredDismissals();
});

chrome.runtime.onStartup.addListener(() => {
  void cleanupExpiredDismissals();
});
