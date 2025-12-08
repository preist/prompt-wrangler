import EmailIcon from '@popup/components/IssueListItem/assets/email.svg?react';
import PhoneIcon from '@popup/components/IssueListItem/assets/phone.svg?react';
import CreditCardIcon from '@popup/components/IssueListItem/assets/credit_card.svg?react';
import SsnIcon from '@popup/components/IssueListItem/assets/ssn.svg?react';

export function getIssueIcon(type: string, className?: string) {
  switch (type) {
    case 'email':
      return <EmailIcon className={className} />;
    case 'phone':
      return <PhoneIcon className={className} />;
    case 'creditCard':
      return <CreditCardIcon className={className} />;
    case 'ssn':
      return <SsnIcon className={className} />;
    default:
      return null;
  }
}

export function formatTimestamp(timestamp: number) {
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
