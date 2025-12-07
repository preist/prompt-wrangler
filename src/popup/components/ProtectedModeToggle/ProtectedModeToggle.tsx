import { useSettings } from '@popup/hooks/useSettings';
import { Toggle } from '@popup/components/Toggle/Toggle';

export function ProtectedModeToggle() {
  const { protectedMode, toggleProtectedMode } = useSettings();

  return (
    <div className="protected-mode-toggle">
      <Toggle label="Protected Mode" checked={protectedMode} onChange={toggleProtectedMode} large />
    </div>
  );
}
