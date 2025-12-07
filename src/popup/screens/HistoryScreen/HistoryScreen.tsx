import { useIssues } from '@popup/hooks/useIssues';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import EmailIcon from '@popup/components/IssueListItem/assets/email.svg?react';
import PhoneIcon from '@popup/components/IssueListItem/assets/phone.svg?react';
import CreditCardIcon from '@popup/components/IssueListItem/assets/credit_card.svg?react';
import SsnIcon from '@popup/components/IssueListItem/assets/ssn.svg?react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  email: EmailIcon,
  phone: PhoneIcon,
  creditCard: CreditCardIcon,
  ssn: SsnIcon,
};

function getIcon(type: string) {
  const IconComponent = ICON_MAP[type];
  if (!IconComponent) return null;
  return <IconComponent className="history-screen__item-icon" />;
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

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
            <div key={issue.id} className="history-screen__item">
              {getIcon(issue.type)}
              <div className="history-screen__item-content">
                <div className="history-screen__item-value">{issue.value}</div>
                <div className="history-screen__item-timestamp">
                  {formatTimestamp(issue.timestamp)}
                </div>
              </div>
              <button
                type="button"
                className="history-screen__item-delete"
                onClick={() => {
                  void deleteFromHistory(issue.id);
                }}
                aria-label="Delete from history"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
