import { splitProps } from "solid-js";
import type { JSX, JSXElement } from "solid-js";

type ButtonAttributes = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

type LabeledOrNot =
  | { label: string; children?: null }
  | { label?: null; children?: JSXElement };

const base = `cursor-pointer transition-colors ease-in-out duration-[0.25s] w-full text-left p-2 rounded-md hover:bg-[color:var(--background-hover-color)]`;

const variants = {
  default: "",
  "context-menu": `rounded bg-transparent transition-[background-color]`,
  page: "rounded border-2 border-solid",
  toolbar: "size-10",
};

type Variant = keyof typeof variants;

type ButtonVariants<TVariant extends Variant> = {
  variant?: TVariant;
};

type ButtonProps<TVariant extends Variant> = ButtonAttributes &
  LabeledOrNot &
  ButtonVariants<TVariant>;

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
      {...rest}
    >
      {local.label ?? local.children}
    </button>
  );
}

export default Button;
