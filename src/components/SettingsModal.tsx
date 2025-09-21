import { createEffect } from "solid-js";
import type { JSXElement } from "solid-js";

import type { EditorSettings } from "~/types";

const TextSpellcheckGroup = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSXElement => (
  <div class="settings-group toggle-setting">
    <label for="text-autocorrection-toggle">Text Spellcheck</label>
    <input
      id="text-autocorrection-toggle"
      type="checkbox"
      checked={props.settings.spellcheck}
      onInput={(e) => props.updateSettings({ spellcheck: e.target.checked })}
    />
  </div>
);

const FontSizeGroup = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSXElement => (
  <div class="settings-group">
    <label>Font Size</label>
    <input
      type="number"
      min="8"
      max="72"
      value={props.settings.fontSize}
      onInput={(e) =>
        props.updateSettings({ fontSize: parseInt(e.target.value, 10) })
      }
    />
  </div>
);

const FontFamilyGroup = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSXElement => (
  <div class="settings-group">
    <label>Font Family</label>
    <select
      value={props.settings.fontFamily}
      onInput={(e) => props.updateSettings({ fontFamily: e.target.value })}
    >
      <option value="Cousine">Cousine</option>
      <option value="Arial">Arial</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
    </select>
  </div>
);

const TextAlignmentGroup = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSXElement => (
  <div class="settings-group">
    <label>Text Alignment</label>
    <select
      value={props.settings.textAlign}
      onInput={(e) =>
        props.updateSettings({
          textAlign: e.target.value as EditorSettings["textAlign"],
        })
      }
    >
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="justify">Justify</option>
    </select>
  </div>
);

const SettingsForm = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSXElement => (
  <form class="flex flex-col gap-5 p-6" method="dialog">
    <TextSpellcheckGroup
      settings={props.settings}
      updateSettings={props.updateSettings}
    />

    <FontSizeGroup
      settings={props.settings}
      updateSettings={props.updateSettings}
    />

    <FontFamilyGroup
      settings={props.settings}
      updateSettings={props.updateSettings}
    />

    <TextAlignmentGroup
      settings={props.settings}
      updateSettings={props.updateSettings}
    />
  </form>
);

const SettingsModal = (props: {
  isOpen: boolean;
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  closeSettingsModal: () => void;
}): JSXElement => {
  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (!dialogRef) return;
    if (props.isOpen && !dialogRef.open) {
      dialogRef.showModal();
    } else if (!props.isOpen && dialogRef.open) {
      dialogRef.close();
    }
  });

  const handleBackdropClick = (event: MouseEvent) => {
    if (dialogRef && event.target === dialogRef) {
      props.closeSettingsModal();
    }
  };

  return (
    <dialog
      class="fixed -translate-x-2/4 -translate-y-2/4 [background:var(--float-bg-color)]
            border border-[color:var(--float-border-color)] min-w-[300px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]
            rounded-lg border-solid left-2/4 top-2/4 backdrop:[background:rgba(0,0,0,0.5)]"
      ref={dialogRef}
      onClose={props.closeSettingsModal}
      onClick={handleBackdropClick}
    >
      <SettingsForm
        settings={props.settings}
        updateSettings={props.updateSettings}
      />
    </dialog>
  );
};

export default SettingsModal;
