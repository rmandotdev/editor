import type { JSX } from "solid-js";
import { splitProps } from "solid-js";

type ButtonAttributes = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const base = `cursor-pointer w-full text-left p-2 rounded-md hover:bg-[#ddd] dark:hover:bg-[#333] text-black dark:text-white`;

const variants = {
  default: "",
  "context-menu": `rounded bg-transparent`,
  page: "rounded border-2 border-solid",
  toolbar: "size-10",
};

type Variant = keyof typeof variants;

type ButtonVariants<TVariant extends Variant> = {
  variant?: TVariant;
};

type ButtonProps<TVariant extends Variant> =
  | ({ label: string; children?: never } & ButtonAttributes &
      ButtonVariants<TVariant>)
  | ({ children: JSX.Element; label?: never } & ButtonAttributes &
      ButtonVariants<TVariant>);

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
