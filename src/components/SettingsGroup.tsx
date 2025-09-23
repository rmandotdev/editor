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
      class={`settings-group ${
        props.variant === "checkbox" ? "toggle-setting" : ""
      }`}
    >
      <label
        for={props.variant === "checkbox" ? `${props.key}-toggle` : undefined}
      >
        {props.label}
      </label>
      <Switch>
        <Match when={props.variant === "checkbox" && props} keyed>
          {(props) => (
            <input
              id={`${props.key}-toggle`}
              type="checkbox"
              checked={props.value}
              onInput={(e) => props.updateValue(e.target.checked)}
            />
          )}
        </Match>
        <Match when={props.variant === "number" && props} keyed>
          {(props) => (
            <input
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
