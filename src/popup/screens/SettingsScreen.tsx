import { useSettings } from '../hooks/useSettings';
import Toggle from '../components/Toggle';

export default function SettingsScreen() {
  const {
    protectedMode,
    enabledPlatforms,
    enabledDataTypes,
    toggleProtectedMode,
    togglePlatform,
    toggleDataType,
  } = useSettings();

  return (
    <div className="settings-screen">
      <div className="settings-screen__section">
        <Toggle
          label="Protected Mode"
          description="Enable or disable all protection features"
          checked={protectedMode}
          onChange={toggleProtectedMode}
        />
      </div>

      <div className="settings-screen__section">
        <h2 className="settings-screen__heading">Platforms</h2>
        <Toggle
          label="ChatGPT"
          checked={enabledPlatforms.chatgpt}
          disabled={!protectedMode}
          onChange={() => togglePlatform('chatgpt')}
        />
        <Toggle
          label="Claude"
          description="Coming soon"
          checked={enabledPlatforms.claude}
          disabled
          onChange={() => togglePlatform('claude')}
        />
      </div>

      <div className="settings-screen__section">
        <h2 className="settings-screen__heading">Private Data</h2>
        <Toggle
          label="Email Addresses"
          checked={enabledDataTypes.email}
          disabled={!protectedMode}
          onChange={() => toggleDataType('email')}
        />
        <Toggle
          label="Phone Numbers"
          checked={enabledDataTypes.phone}
          disabled={!protectedMode}
          onChange={() => toggleDataType('phone')}
        />
        <Toggle
          label="Credit Card Information"
          checked={enabledDataTypes.creditCard}
          disabled={!protectedMode}
          onChange={() => toggleDataType('creditCard')}
        />
        <Toggle
          label="Social Security Numbers"
          checked={enabledDataTypes.ssn}
          disabled={!protectedMode}
          onChange={() => toggleDataType('ssn')}
        />
        <Toggle
          label="Addresses"
          checked={enabledDataTypes.address}
          disabled={!protectedMode}
          onChange={() => toggleDataType('address')}
        />
      </div>
    </div>
  );
}
