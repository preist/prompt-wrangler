import { useEffect } from 'react';
import { useIssues } from '@popup/hooks/useIssues';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { IssueListItem } from '@popup/components/IssueListItem/IssueListItem';

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
        <ProtectedModeToggle />
        <div className="issues-found-screen__empty">
          <div className="issues-found-screen__empty-title">No issues found</div>
          <div className="issues-found-screen__empty-description">
            Tumbleweeds, your prompts are clean and secure
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="issues-found-screen">
      <ProtectedModeToggle />
      <div className="issues-found-screen__panel">
        <div className="issues-found-screen__header">
          <h2 className="issues-found-screen__title">Issues Found</h2>
          <button
            type="button"
            className="issues-found-screen__clear-button"
            onClick={() => {
              void markIssuesAsViewed();
            }}
          >
            Clear all
          </button>
        </div>
        <div className="issues-found-screen__items">
          {activeIssues.map((issue) => (
            <IssueListItem key={issue.id} issue={issue} onDismiss={dismissIssue} />
          ))}
        </div>
      </div>
    </div>
  );
}
