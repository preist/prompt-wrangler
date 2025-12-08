import { classnames } from '@lib/utils/classnames';
import ShieldIcon from './assets/shield.svg?react';
import CalendarIcon from './assets/calendar.svg?react';
import SettingsIcon from './assets/settings.svg?react';

export type Screen = 'issues' | 'history' | 'settings';

interface NavigationProps {
  current: Screen;
  className?: string;
  onChange: (screen: Screen) => void;
}

export function Navigation(props: NavigationProps) {
  const { current, className, onChange } = props;

  return (
    <nav className={classnames('navigation', className)}>
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
