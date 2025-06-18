import { useState, useEffect } from "react";
import { EditorSettings } from "../types";

const DEFAULT_SETTINGS: EditorSettings = {
  autocorrect: true,
  fontSize: 16,
  fontFamily: "Cousine",
  textAlign: "left",
};

export function useEditorSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedSettings = localStorage.getItem("editor-settings");
    if (storedSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
    }
  }, []);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem("editor-settings", JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
}
