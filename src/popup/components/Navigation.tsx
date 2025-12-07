export type Screen = 'issues' | 'history' | 'settings';

interface NavigationProps {
  current: Screen;
  onChange: (screen: Screen) => void;
}

export default function Navigation({ current, onChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <button
        type="button"
        className={`navigation__button ${current === 'issues' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('issues');
        }}
      >
        <span className="navigation__icon">⚠️</span>
        <span className="navigation__label">Issues</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'history' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('history');
        }}
      >
        <span className="navigation__icon">📜</span>
        <span className="navigation__label">History</span>
      </button>
      <button
        type="button"
        className={`navigation__button ${current === 'settings' ? 'navigation__button--active' : ''}`}
        onClick={() => {
          onChange('settings');
        }}
      >
        <span className="navigation__icon">⚙️</span>
        <span className="navigation__label">Settings</span>
      </button>
    </nav>
  );
}
