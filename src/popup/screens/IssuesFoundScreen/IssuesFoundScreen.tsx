import { useEffect } from 'react';
import { useIssues } from '@popup/hooks/useIssues';

export function IssuesFoundScreen() {
  const { latestIssues, dismissIssue, clearDismissed, markIssuesAsViewed } = useIssues();

  useEffect(() => {
    // Clear badge when viewing issues screen
    void chrome.action.setBadgeText({ text: '' });

    const interval = setInterval(() => {
      clearDismissed();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [clearDismissed]);

  const activeIssues = latestIssues.filter((issue) => !issue.dismissed);

  if (activeIssues.length === 0) {
    return (
      <div className="issues-found-screen">
        <div className="issues-found-screen__empty">
          <div className="issues-found-screen__empty-icon">✓</div>
          <div className="issues-found-screen__empty-title">No Issues Found</div>
          <div className="issues-found-screen__empty-description">
            Your prompts are clean and secure
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-found-screen">
      <div className="issues-found-screen__header">
        <button
          type="button"
          className="issues-found-screen__clear-button"
          onClick={() => {
            void markIssuesAsViewed();
          }}
        >
          Clear Issues
        </button>
      </div>
      <div className="issues-found-screen__list">
        {activeIssues.map((issue) => (
          <div key={issue.id} className="issues-found-screen__item">
            <div className="issues-found-screen__item-content">
              <div className="issues-found-screen__item-type">{issue.type}</div>
              <div className="issues-found-screen__item-value">{issue.value}</div>
            </div>
            <div className="issues-found-screen__item-actions">
              <button
                type="button"
                className="issues-found-screen__dismiss-button"
                onClick={() => dismissIssue(issue.id, '24h')}
              >
                Dismiss for 24h
              </button>
              <button
                type="button"
                className="issues-found-screen__dismiss-button issues-found-screen__dismiss-button--forever"
                onClick={() => dismissIssue(issue.id, 'forever')}
              >
                Dismiss forever
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
