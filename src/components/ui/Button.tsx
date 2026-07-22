import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

type ButtonAttributes = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const base = `cursor-pointer touch-manipulation w-full text-left p-2 rounded-md hover:bg-[#ddd] dark:hover:bg-[#333] text-black dark:text-white`;

const variants = {
  default: "",
  "context-menu": "rounded bg-transparent",
  page: "rounded border-2 border-solid",
  toolbar: "size-10",
};

type Variant = keyof typeof variants;

type ButtonProps<TVariant extends Variant> = ButtonAttributes & {
  label: string;
  children?: JSX.Element;
  variant?: TVariant;
};

function Button<TVariant extends Variant>(props: ButtonProps<TVariant>) {
  const [local, rest] = splitProps(props, [
    "label",
    "class",
    "variant",
    "children",
  ]);

  return (
    <button
      class={`${base} ${variants[local.variant ?? "default"]} ${
        local.class ?? ""
      }`}
      aria-label={local.label}
      {...rest}
    >
      {local.children ?? local.label}
    </button>
  );
}

export default Button;
