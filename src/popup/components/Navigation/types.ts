export type Screen = 'issues' | 'history' | 'settings';

export interface NavigationProps {
  current: Screen;
  onChange: (screen: Screen) => void;
}
