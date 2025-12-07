import { SettingsProvider } from '@popup/state/SettingsContext';
import { IssuesProvider } from '@popup/state/IssuesContext';
import { AppLayout } from '@popup/layouts/AppLayout/AppLayout';

export function App() {
  return (
    <SettingsProvider>
      <IssuesProvider>
        <AppLayout />
      </IssuesProvider>
    </SettingsProvider>
  );
}
