import { createSignal, onMount } from "solid-js";

import type { EditorSettings } from "~/types";

const STORAGE_KEY = "editor-settings";

const DEFAULT_SETTINGS: EditorSettings = {
  spellcheck: true,
  fontSize: 16,
  fontFamily: "Cousine",
  textAlign: "left",
};

export function useEditorSettings() {
  const [settings, setSettings] =
    createSignal<EditorSettings>(DEFAULT_SETTINGS);

  onMount(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
    }

    window.addEventListener("storage", (event) => {
      if (!event.newValue) return;
      if (event.key === STORAGE_KEY) {
        const newSettings = JSON.parse(event.newValue) as EditorSettings;
        setSettings(newSettings);
      }
    });
  });

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    const updatedSettings = { ...settings(), ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
}
