import ShieldIcon from './assets/shield.svg?react';
import CalendarIcon from './assets/calendar.svg?react';
import SettingsIcon from './assets/settings.svg?react';
import type { NavigationProps } from './types';

export type { Screen } from './types';

export function Navigation({ current, onChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <button
        type="button"
        className={`navigation__button ${current === 'issues' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('issues');
        }}
      >
        <ShieldIcon className="navigation__icon" />
        <span className="navigation__label">Issues</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'history' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('history');
        }}
      >
        <CalendarIcon className="navigation__icon" />
        <span className="navigation__label">History</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'settings' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('settings');
        }}
      >
        <SettingsIcon className="navigation__icon" />
        <span className="navigation__label">Settings</span>
      </button>
    </nav>
  );
}
