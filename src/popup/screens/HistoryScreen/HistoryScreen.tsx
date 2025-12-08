import { useIssues } from '@popup/hooks/useIssues';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { HistoryItem } from '@popup/components/HistoryItem/HistoryItem';
import { getIssueIcon, formatTimestamp } from '@popup/utils/issueHelpers';

export function HistoryScreen() {
  const { history, deleteFromHistory, clearAllHistory } = useIssues();

  if (history.length === 0) {
    return (
      <div className="history-screen">
        <ProtectedModeToggle />
        <div className="history-screen__empty">
          <div className="history-screen__empty-title">No History Yet</div>
          <div className="history-screen__empty-description">Detected issues will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <ProtectedModeToggle />

      <div className="history-screen__panel">
        <div className="history-screen__header">
          <h2 className="history-screen__title">History</h2>
          <button
            type="button"
            className="history-screen__clear-button"
            onClick={() => {
              void clearAllHistory();
            }}
          >
            Clear all
          </button>
        </div>

        <div className="history-screen__list">
          {history.map((issue) => (
            <HistoryItem
              key={issue.id}
              icon={getIssueIcon(issue.type, 'history-screen__item-icon')}
              value={issue.value}
              timestamp={formatTimestamp(issue.timestamp)}
              onDelete={() => {
                void deleteFromHistory(issue.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
