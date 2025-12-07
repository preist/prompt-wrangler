import { useSettings } from '@popup/hooks/useSettings';
import { Toggle } from '@popup/components/Toggle/Toggle';
import { ProtectedModeToggle } from '@popup/components/ProtectedModeToggle/ProtectedModeToggle';

export function SettingsScreen() {
  const { protectedMode, enabledPlatforms, enabledDataTypes, togglePlatform, toggleDataType } =
    useSettings();

  const handleCheckAll = () => {
    if (!protectedMode) return;

    const allChecked =
      enabledDataTypes.email &&
      enabledDataTypes.phone &&
      enabledDataTypes.creditCard &&
      enabledDataTypes.ssn;

    if (!allChecked) {
      if (!enabledDataTypes.email) void toggleDataType('email');
      if (!enabledDataTypes.phone) void toggleDataType('phone');
      if (!enabledDataTypes.creditCard) void toggleDataType('creditCard');
      if (!enabledDataTypes.ssn) void toggleDataType('ssn');
    }
  };

  return (
    <div className="settings-screen">
      <ProtectedModeToggle />

      <div className="settings-screen__panel">
        <div className="settings-screen__header">
          <h2 className="settings-screen__title">Settings</h2>
          <button
            type="button"
            className="settings-screen__check-all-button"
            onClick={handleCheckAll}
            disabled={!protectedMode}
          >
            Check all
          </button>
        </div>

        <div className="settings-screen__content">
          <div className="settings-screen__section">
            <div className="settings-screen__item">
              <div className="settings-screen__item-content">
                <div className="settings-screen__item-title">ChatGPT</div>
                <div className="settings-screen__item-description">Enable for ChatGPT website</div>
              </div>
              <Toggle
                label=""
                checked={enabledPlatforms.chatgpt}
                disabled={!protectedMode}
                onChange={() => togglePlatform('chatgpt')}
              />
            </div>

            <div className="settings-screen__item">
              <div className="settings-screen__item-content">
                <div className="settings-screen__item-title">Claude</div>
                <div className="settings-screen__item-description">Enable for Claude website</div>
              </div>
              <div className="settings-screen__coming-soon">Coming Soon</div>
            </div>
          </div>

          <div className="settings-screen__section">
            <h3 className="settings-screen__section-title">Private data</h3>
            <div className="settings-screen__section-description">
              Select which types of data should be protected
            </div>

            <div className="settings-screen__item">
              <div className="settings-screen__item-title">Email addresses</div>
              <Toggle
                label=""
                checked={enabledDataTypes.email}
                disabled={!protectedMode}
                onChange={() => toggleDataType('email')}
              />
            </div>

            <div className="settings-screen__item">
              <div className="settings-screen__item-title">Phone Numbers</div>
              <Toggle
                label=""
                checked={enabledDataTypes.phone}
                disabled={!protectedMode}
                onChange={() => toggleDataType('phone')}
              />
            </div>

            <div className="settings-screen__item">
              <div className="settings-screen__item-title">Credit Card Information</div>
              <Toggle
                label=""
                checked={enabledDataTypes.creditCard}
                disabled={!protectedMode}
                onChange={() => toggleDataType('creditCard')}
              />
            </div>

            <div className="settings-screen__item">
              <div className="settings-screen__item-title">Social Security Numbers</div>
              <Toggle
                label=""
                checked={enabledDataTypes.ssn}
                disabled={!protectedMode}
                onChange={() => toggleDataType('ssn')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
