import { useSettings } from '@popup/hooks/useSettings';
import { Toggle } from '@popup/components/Toggle/Toggle';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';
import { SettingsSection } from '@popup/components/SettingsSection/SettingsSection';
import { SettingsItem } from '@popup/components/SettingsItem/SettingsItem';

export function SettingsScreen() {
  const {
    protectedMode,
    enabledPlatforms,
    enabledDataTypes,
    togglePlatform,
    toggleDataType,
    enableAllDataTypes,
  } = useSettings();

  const allChecked =
    enabledDataTypes.email &&
    enabledDataTypes.phone &&
    enabledDataTypes.creditCard &&
    enabledDataTypes.ssn;

  const handleCheckAll = () => {
    if (!protectedMode) return;
    void enableAllDataTypes();
  };

  return (
    <div className="settings-screen">
      <ProtectedModeToggle />

      <div className="settings-screen__panel">
        <div className="settings-screen__header">
          <h2 className="settings-screen__title">Settings</h2>
          {!allChecked && (
            <button
              type="button"
              className="settings-screen__check-all-button"
              onClick={handleCheckAll}
              disabled={!protectedMode}
            >
              Check all
            </button>
          )}
        </div>

        <div className="settings-screen__content">
          <SettingsSection>
            <SettingsItem title="ChatGPT" description="Enable for ChatGPT website">
              <Toggle
                label=""
                checked={enabledPlatforms.chatgpt}
                disabled={!protectedMode}
                onChange={() => togglePlatform('chatgpt')}
              />
            </SettingsItem>

            <SettingsItem title="Claude" description="Enable for Claude website">
              <div className="settings-screen__coming-soon">Coming Soon</div>
            </SettingsItem>
          </SettingsSection>

          <SettingsSection
            title="Private data"
            description="Select which types of data should be protected"
          >
            <SettingsItem title="Email addresses">
              <Toggle
                label=""
                checked={enabledDataTypes.email}
                disabled={!protectedMode}
                onChange={() => toggleDataType('email')}
              />
            </SettingsItem>

            <SettingsItem title="Phone Numbers">
              <Toggle
                label=""
                checked={enabledDataTypes.phone}
                disabled={!protectedMode}
                onChange={() => toggleDataType('phone')}
              />
            </SettingsItem>

            <SettingsItem title="Credit Card Information">
              <Toggle
                label=""
                checked={enabledDataTypes.creditCard}
                disabled={!protectedMode}
                onChange={() => toggleDataType('creditCard')}
              />
            </SettingsItem>

            <SettingsItem title="Social Security Numbers">
              <Toggle
                label=""
                checked={enabledDataTypes.ssn}
                disabled={!protectedMode}
                onChange={() => toggleDataType('ssn')}
              />
            </SettingsItem>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
