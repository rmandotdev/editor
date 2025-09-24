import type { JSX } from "solid-js";

import { createEffect } from "solid-js";

import type { EditorSettings } from "~/types";

import SettingsGroup from "./SettingsGroup";

const SettingsForm = (props: {
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}): JSX.Element => (
  <form class="flex flex-col gap-5 p-6" method="dialog">
    <SettingsGroup
      variant="checkbox"
      key="spellcheck"
      label="Text Spellcheck"
      value={props.settings.spellcheck}
      updateValue={(spellcheck) => props.updateSettings({ spellcheck })}
    />

    <SettingsGroup
      variant="number"
      label="Font Size"
      value={props.settings.fontSize}
      updateValue={(fontSize) => props.updateSettings({ fontSize })}
    />

    <SettingsGroup<EditorSettings.FontFamily>
      variant="select"
      label="Font Family"
      value={props.settings.fontFamily}
      options={[
        { value: "Cousine" },
        { value: "Arial" },
        { value: "Times New Roman" },
        { value: "Courier New" },
      ]}
      updateValue={(fontFamily) => props.updateSettings({ fontFamily })}
    />

    <SettingsGroup<EditorSettings.TextAlign>
      variant="select"
      label="Text Alignment"
      value={props.settings.textAlign}
      options={[
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" },
      ]}
      updateValue={(textAlign) => props.updateSettings({ textAlign })}
    />
  </form>
);

const SettingsModal = (props: {
  isOpen: boolean;
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;
  closeSettingsModal: () => void;
}): JSX.Element => {
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
