import { useEffect } from 'react';
import { useIssues } from '@popup/hooks/useIssues';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { IssueList } from '@popup/components/IssueList/IssueList';

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
      <IssueList
        issues={activeIssues}
        onClearAll={() => {
          void markIssuesAsViewed();
        }}
        onDismissIssue={dismissIssue}
      />
    </div>
  );
}
