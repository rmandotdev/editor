import type { JSX } from "solid-js";

const SvgIcon = (props: {
  "stroke-width"?: number | undefined;
  "stroke-linecap"?: "round" | "butt" | "square" | "inherit" | undefined;
  "stroke-linejoin"?:
    | "round"
    | "inherit"
    | "arcs"
    | "bevel"
    | "miter"
    | "miter-clip"
    | undefined;

  children: JSX.Element;
}): JSX.Element => (
  <svg
    class="size-6 bg-transparent stroke-black dark:stroke-white"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 240"
    fill="none"
    stroke="currentColor"
    stroke-width={props["stroke-width"]}
    stroke-linecap={props["stroke-linecap"]}
    stroke-linejoin={props["stroke-linejoin"]}
  >
    {props.children}
  </svg>
);

export default SvgIcon;
