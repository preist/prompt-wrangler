import type { DetectedIssue } from '@lib/detectors/types';
import EmailIcon from './assets/email.svg?react';
import PhoneIcon from './assets/phone.svg?react';
import CreditCardIcon from './assets/credit_card.svg?react';
import SsnIcon from './assets/ssn.svg?react';

interface IssueListItemProps {
  issue: DetectedIssue;
  onDismiss: (id: string, duration: '24h' | 'forever') => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  email: EmailIcon,
  phone: PhoneIcon,
  creditCard: CreditCardIcon,
  ssn: SsnIcon,
};

function getIcon(type: string) {
  const IconComponent = ICON_MAP[type];
  if (!IconComponent) return null;
  return <IconComponent className="issue-list-item__icon" />;
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

export function IssueListItem({ issue, onDismiss }: IssueListItemProps) {
  return (
    <div className="issue-list-item">
      {getIcon(issue.type)}
      <div className="issue-list-item__content">
        <div className="issue-list-item__value">{issue.value}</div>
        <div className="issue-list-item__timestamp">{formatTimestamp(issue.timestamp)}</div>
        <div className="issue-list-item__actions">
          <button
            type="button"
            className="issue-list-item__dismiss-button"
            onClick={() => {
              onDismiss(issue.id, '24h');
            }}
          >
            Dismiss for 24 hours
          </button>
          <button
            type="button"
            className="issue-list-item__dismiss-button issue-list-item__dismiss-button--forever"
            onClick={() => {
              onDismiss(issue.id, 'forever');
            }}
          >
            Dismiss forever
          </button>
        </div>
      </div>
    </div>
  );
}
