import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface EnabledPlatforms {
  chatgpt: boolean;
  claude: boolean;
}

export interface EnabledDataTypes {
  email: boolean;
  phone: boolean;
  creditCard: boolean;
  ssn: boolean;
  address: boolean;
}

export interface SettingsContextValue {
  protectedMode: boolean;
  enabledPlatforms: EnabledPlatforms;
  enabledDataTypes: EnabledDataTypes;
  toggleProtectedMode: () => Promise<void>;
  togglePlatform: (platform: keyof EnabledPlatforms) => Promise<void>;
  toggleDataType: (type: keyof EnabledDataTypes) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const DEFAULT_SETTINGS = {
  protectedMode: true,
  enabledPlatforms: {
    chatgpt: true,
    claude: false,
  },
  enabledDataTypes: {
    email: true,
    phone: true,
    creditCard: true,
    ssn: false,
    address: false,
  },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [protectedMode, setProtectedMode] = useState(DEFAULT_SETTINGS.protectedMode);
  const [enabledPlatforms, setEnabledPlatforms] = useState(DEFAULT_SETTINGS.enabledPlatforms);
  const [enabledDataTypes, setEnabledDataTypes] = useState(DEFAULT_SETTINGS.enabledDataTypes);

  // Load settings from chrome.storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      const result = await chrome.storage.local.get([
        'settings.protectedMode',
        'settings.platforms',
        'settings.dataTypes',
      ]);

      if (result['settings.protectedMode'] !== undefined) {
        setProtectedMode(result['settings.protectedMode'] as boolean);
      }
      if (result['settings.platforms']) {
        setEnabledPlatforms(result['settings.platforms'] as EnabledPlatforms);
      }
      if (result['settings.dataTypes']) {
        setEnabledDataTypes(result['settings.dataTypes'] as EnabledDataTypes);
      }
    };

    void loadSettings();
  }, []);

  const toggleProtectedMode = async () => {
    const newValue = !protectedMode;
    setProtectedMode(newValue);

    // If turning on Protected Mode, ensure at least ChatGPT is enabled
    let updatedPlatforms = enabledPlatforms;
    if (newValue && !enabledPlatforms.chatgpt && !enabledPlatforms.claude) {
      updatedPlatforms = {
        ...enabledPlatforms,
        chatgpt: true,
      };
      setEnabledPlatforms(updatedPlatforms);
      await chrome.storage.local.set({ 'settings.platforms': updatedPlatforms });
    }

    await chrome.storage.local.set({ 'settings.protectedMode': newValue });

    // Notify content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      void chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_PROTECTED_MODE',
        enabled: newValue,
      });
    }
  };

  const togglePlatform = async (platform: keyof EnabledPlatforms) => {
    const newPlatforms = {
      ...enabledPlatforms,
      [platform]: !enabledPlatforms[platform],
    };
    setEnabledPlatforms(newPlatforms);
    await chrome.storage.local.set({ 'settings.platforms': newPlatforms });

    // If all platforms are now disabled, turn off Protected Mode
    if (!newPlatforms.chatgpt && !newPlatforms.claude && protectedMode) {
      setProtectedMode(false);
      await chrome.storage.local.set({ 'settings.protectedMode': false });

      // Notify content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        void chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_PROTECTED_MODE',
          enabled: false,
        });
      }
    }
  };

  const toggleDataType = async (type: keyof EnabledDataTypes) => {
    const newDataTypes = {
      ...enabledDataTypes,
      [type]: !enabledDataTypes[type],
    };
    setEnabledDataTypes(newDataTypes);
    await chrome.storage.local.set({ 'settings.dataTypes': newDataTypes });
  };

  return (
    <SettingsContext.Provider
      value={{
        protectedMode,
        enabledPlatforms,
        enabledDataTypes,
        toggleProtectedMode,
        togglePlatform,
        toggleDataType,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
