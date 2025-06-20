import { JSX, createEffect } from "solid-js";
import { EditorSettings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  settings: EditorSettings;
  onSettingsChange: (settings: Partial<EditorSettings>) => void;
  onClose: () => void;
}

const SettingsModal = (props: SettingsModalProps): JSX.Element | null => {
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
      props.onClose();
    }
  };

  return (
    <dialog
      id="settings-modal"
      class="modal"
      ref={dialogRef}
      onClose={props.onClose}
      onClick={handleBackdropClick}
    >
      <form id="settings-form" class="modal-form" method="dialog">
        <div class="settings-group toggle-setting">
          <label for="text-autocorrection-toggle">Text Autocorrection</label>
          <input
            id="text-autocorrection-toggle"
            type="checkbox"
            checked={props.settings.autocorrect}
            onInput={(e) =>
              props.onSettingsChange({
                autocorrect: (e.target as HTMLInputElement).checked,
              })
            }
          />
        </div>
        <div class="settings-group">
          <label>Font Size</label>
          <input
            type="number"
            min="8"
            max="72"
            value={props.settings.fontSize}
            onInput={(e) =>
              props.onSettingsChange({
                fontSize: parseInt((e.target as HTMLInputElement).value, 10),
              })
            }
          />
        </div>
        <div class="settings-group">
          <label>Font Family</label>
          <select
            value={props.settings.fontFamily}
            onInput={(e) =>
              props.onSettingsChange({
                fontFamily: (e.target as HTMLSelectElement).value,
              })
            }
          >
            <option value="Cousine">Cousine</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        <div class="settings-group">
          <label>Text Alignment</label>
          <select
            value={props.settings.textAlign}
            onInput={(e) =>
              props.onSettingsChange({
                textAlign: (e.target as HTMLSelectElement)
                  .value as EditorSettings["textAlign"],
              })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </form>
    </dialog>
  );
};

export default SettingsModal;
