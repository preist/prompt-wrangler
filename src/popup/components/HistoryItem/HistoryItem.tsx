import type { ReactNode } from 'react';
import './HistoryItem.scss';

interface HistoryItemProps {
  icon: ReactNode;
  value: string;
  timestamp: string;
  onDelete: () => void;
}

export function HistoryItem({ icon, value, timestamp, onDelete }: HistoryItemProps) {
  return (
    <div className="history-item">
      {icon}
      <div className="history-item__content">
        <div className="history-item__value">{value}</div>
        <div className="history-item__timestamp">{timestamp}</div>
      </div>
      <button
        type="button"
        className="history-item__delete"
        onClick={onDelete}
        aria-label="Delete from history"
      >
        ×
      </button>
    </div>
  );
}
