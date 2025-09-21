import { For, Show } from "solid-js";
import type { JSXElement } from "solid-js";

import Button from "./Button";

type ContextMenuItem = {
  label: string;
  onClick: () => void;
  show?: boolean;
};

const ContextMenu = (props: {
  x: number;
  y: number;
  items: ContextMenuItem[];
}): JSXElement => {
  return (
    <div
      class="absolute z-30 bg-[color:var(--float-bg-color)] border border-[color:var(--float-border-color)]
            shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-2 rounded-md border-solid"
      style={{ left: `${props.x}px`, top: `${props.y}px` }}
    >
      <For each={props.items}>
        {(item) => (
          <Show when={item.show ?? true}>
            <Button label={item.label} onClick={item.onClick} />
          </Show>
        )}
      </For>
    </div>
  );
};

export default ContextMenu;
