import { Match, Switch, type JSX } from "solid-js";

type SettingGroupConfigMap<SelectVal extends string = string> = {
  checkbox: { value: boolean; key: string };
  number: { value: number; min?: number; max?: number };
  select: { value: SelectVal; options: { value: SelectVal; label?: string }[] };
};

type SettingGroupConfigVariant = keyof SettingGroupConfigMap;

type SettingGroupOptions<
  TVariant extends SettingGroupConfigVariant,
  TSelectValue extends string
> = SettingGroupConfigMap<TSelectValue>[TVariant] & {
  variant: TVariant;
  label: string;
  updateValue: (
    value: SettingGroupConfigMap<TSelectValue>[TVariant]["value"]
  ) => void;
};

type SettingGroupPropsMap<TSelectValue extends string> = {
  [TVariant in SettingGroupConfigVariant]: SettingGroupOptions<
    TVariant,
    TSelectValue
  >;
};

type SettingGroupProps<TSelectValue extends string> =
  SettingGroupPropsMap<TSelectValue>[SettingGroupConfigVariant];

const SettingsGroup = <TSelectValue extends string>(
  props: SettingGroupProps<TSelectValue>
): JSX.Element => {
  return (
    <div
      class={`flex flex-col gap-2
        ${props.variant === "checkbox" ? "flex-row justify-between" : ""}
      `}
    >
      <label
        class="leading-none font-medium"
        for={props.variant === "checkbox" ? `${props.key}-toggle` : undefined}
      >
        {props.label}
      </label>
      <Switch>
        <Match when={props.variant === "checkbox" && props} keyed>
          {(props) => (
            <input
              id={`${props.key}-toggle`}
              class="w-4"
              type="checkbox"
              checked={props.value}
              onInput={(e) => props.updateValue(e.target.checked)}
            />
          )}
        </Match>
        <Match when={props.variant === "number" && props} keyed>
          {(props) => (
            <input
              class="border border-solid border-[#d8d8d8] dark:border-[#272727]
                     bg-[#ededed] dark:bg-[#181818] text-black dark:text-white
                     rounded w-full p-1"
              type="number"
              min={props.min}
              max={props.max}
              value={props.value}
              onInput={(e) => props.updateValue(parseInt(e.target.value, 10))}
            />
          )}
        </Match>
        <Match when={props.variant === "select" && props} keyed>
          {(props) => (
            <select
              class="border border-solid border-[#d8d8d8] dark:border-[#272727]
                     bg-[#ededed] dark:bg-[#181818] text-black dark:text-white
                     rounded w-full p-1 min-w-30"
              value={props.value}
              onInput={(e) => props.updateValue(e.target.value as TSelectValue)}
            >
              {props.options.map((option) => (
                <option value={option.value}>
                  {option.label ?? option.value}
                </option>
              ))}
            </select>
          )}
        </Match>
      </Switch>
    </div>
  );
};

export default SettingsGroup;
