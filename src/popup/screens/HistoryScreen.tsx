import { useMemo } from 'react';
import { useIssues } from '../hooks/useIssues';
import type { Issue } from '../contexts/IssuesContext';

interface BatchGroup {
  batchId: string;
  timestamp: number;
  issues: Issue[];
}

export default function HistoryScreen() {
  const { history, deleteFromHistory, clearAllHistory } = useIssues();

  // Group issues by batchId
  const batches = useMemo(() => {
    const batchMap = new Map<string, BatchGroup>();

    history.forEach((issue) => {
      if (!batchMap.has(issue.batchId)) {
        batchMap.set(issue.batchId, {
          batchId: issue.batchId,
          timestamp: issue.timestamp,
          issues: [],
        });
      }
      batchMap.get(issue.batchId)?.issues.push(issue);
    });

    // Convert to array and sort by timestamp (newest first)
    return Array.from(batchMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [history]);

  if (batches.length === 0) {
    return (
      <div className="history-screen">
        <div className="history-screen__empty">
          <div className="history-screen__empty-icon">📜</div>
          <div className="history-screen__empty-title">No History Yet</div>
          <div className="history-screen__empty-description">Detected issues will appear here</div>
        </div>
      </div>
    );
  }

  const getIssueIcon = (type: Issue['type']) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'phone':
        return '📞';
      case 'creditCard':
        return '💳';
      case 'ssn':
        return '🆔';
    }
  };

  return (
    <div className="history-screen">
      <div className="history-screen__header">
        <button
          type="button"
          className="history-screen__clear-button"
          onClick={() => {
            void clearAllHistory();
          }}
        >
          Clear All
        </button>
      </div>
      <div className="history-screen__list">
        {batches.map((batch) => (
          <div key={batch.batchId} className="history-screen__batch">
            <div className="history-screen__batch-header">
              <div className="history-screen__batch-title">
                Prompt from {new Date(batch.timestamp).toLocaleString()}
              </div>
              <div className="history-screen__batch-count">{batch.issues.length} issue(s)</div>
            </div>
            <div className="history-screen__batch-issues">
              {batch.issues.map((issue) => (
                <div key={issue.id} className="history-screen__item">
                  <div className="history-screen__item-icon">{getIssueIcon(issue.type)}</div>
                  <div className="history-screen__item-content">
                    <div className="history-screen__item-value">{issue.value}</div>
                    {issue.dismissed && (
                      <div className="history-screen__item-status">
                        Dismissed {issue.dismissed.until === 'forever' ? 'forever' : 'for 24h'}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="history-screen__delete-button"
                    onClick={() => {
                      void deleteFromHistory(issue.id);
                    }}
                    aria-label="Delete from history"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
