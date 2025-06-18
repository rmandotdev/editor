import { FunctionComponent, useRef, useEffect } from "react";
import { EditorSettings } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  settings: EditorSettings;
  onSettingsChange: (settings: Partial<EditorSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: FunctionComponent<SettingsModalProps> = ({
  isOpen,
  settings,
  onSettingsChange,
  onClose,
}) => {
  if (!isOpen) return null;

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;
    if (isOpen) dialogElement.showModal();
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialogElement = dialogRef.current;
    if (dialogElement && event.target === dialogElement) {
      onClose();
    }
  };

  return (
    <dialog
      id="settings-modal"
      className="modal"
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <form id="settings-form" className="modal-form" method="dialog">
        <div className="settings-group toggle-setting">
          <label htmlFor="text-autocorrection-toggle">
            Text Autocorrection
          </label>
          <input
            id="text-autocorrection-toggle"
            type="checkbox"
            checked={settings.autocorrect}
            onChange={(e) =>
              onSettingsChange({ autocorrect: e.target.checked })
            }
          />
        </div>
        <div className="settings-group">
          <label>Font Size</label>
          <input
            type="number"
            min="8"
            max="72"
            value={settings.fontSize}
            onChange={(e) =>
              onSettingsChange({ fontSize: parseInt(e.target.value, 10) })
            }
          />
        </div>
        <div className="settings-group">
          <label>Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
          >
            <option value="Cousine">Cousine</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
        <div className="settings-group">
          <label>Text Alignment</label>
          <select
            value={settings.textAlign}
            onChange={(e) =>
              onSettingsChange({
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
      </form>
    </dialog>
  );
};
