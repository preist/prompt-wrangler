import { useState } from 'react';
import { SettingsProvider } from './contexts/SettingsContext';
import { IssuesProvider } from './contexts/IssuesContext';
import Navigation, { type Screen } from './components/Navigation';
import IssuesFoundScreen from './screens/IssuesFoundScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('issues');

  return (
    <div className="app">
      <div className="app__content">
        {currentScreen === 'issues' && <IssuesFoundScreen />}
        {currentScreen === 'history' && <HistoryScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </div>
      <Navigation current={currentScreen} onChange={setCurrentScreen} />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <IssuesProvider>
        <AppContent />
      </IssuesProvider>
    </SettingsProvider>
  );
}
