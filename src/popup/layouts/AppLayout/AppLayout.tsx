import { useState } from 'react';
import { Navigation } from '@popup/components/Navigation/Navigation';
import { IssuesFoundScreen } from '@popup/screens/IssuesFoundScreen/IssuesFoundScreen';
import { HistoryScreen } from '@popup/screens/HistoryScreen/HistoryScreen';
import { SettingsScreen } from '@popup/screens/SettingsScreen/SettingsScreen';
import { Footer } from './components/Footer';
import type { Screen } from '@popup/components/Navigation/Navigation';

export function AppLayout() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('issues');

  return (
    <div className="app">
      <Navigation current={currentScreen} onChange={setCurrentScreen} />
      <div className="app__content">
        {currentScreen === 'issues' && <IssuesFoundScreen />}
        {currentScreen === 'history' && <HistoryScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <Footer />
    </div>
  );
}
