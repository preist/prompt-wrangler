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
