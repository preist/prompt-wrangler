import type { DetectedIssue } from '@lib/detectors/types';
import { IssueListItem } from '@popup/components/IssueListItem/IssueListItem';

interface IssueListProps {
  issues: DetectedIssue[];
  onClearAll: () => void;
  onDismissIssue: (id: string, duration: '24h' | 'forever') => void;
}

export function IssueList({ issues, onClearAll, onDismissIssue }: IssueListProps) {
  return (
    <div className="issue-list">
      <div className="issue-list__header">
        <h2 className="issue-list__title">Issues Found</h2>
        <button type="button" className="issue-list__clear-button" onClick={onClearAll}>
          Clear all
        </button>
      </div>
      <div className="issue-list__items">
        {issues.map((issue) => (
          <IssueListItem key={issue.id} issue={issue} onDismiss={onDismissIssue} />
        ))}
      </div>
    </div>
  );
}
