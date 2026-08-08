import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { AngleMode } from "../../domain/model/AngleMode";
import { NumericMode } from "../../domain/model/NumericMode";
import { ThemePreference } from "../../domain/model/ThemePreference";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import {
  AccessibleSelectComponent,
  type AccessibleSelectOption,
} from "../primitives/AccessibleSelectComponent";
import { AccessibleSwitchComponent } from "../primitives/AccessibleSwitchComponent";
import { cssClass } from "../utils/classNames";
import styles from "../styles/SettingsPanelComponent.module.css";

const ANGLE_MODE_OPTIONS: readonly AccessibleSelectOption[] = [
  { id: AngleMode.DEG, label: "Degrees (DEG)" },
  { id: AngleMode.RAD, label: "Radians (RAD)" },
  { id: AngleMode.GON, label: "Gons (GON)" },
];

const THEME_OPTIONS: readonly AccessibleSelectOption[] = [
  { id: ThemePreference.LIGHT, label: "Light" },
  { id: ThemePreference.DARK, label: "Dark" },
  { id: ThemePreference.SYSTEM, label: "System" },
];

export function SettingsPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();

  const numericModeOptions: readonly AccessibleSelectOption[] =
    viewModel.supportedNumericModes.map((mode) => ({
      id: mode,
      label: mode,
    }));

  return (
    <div className={cssClass(styles.panel)}>
      <div className={cssClass(styles.settingRow)}>
        <AccessibleSelectComponent
          label="Angle mode"
          options={ANGLE_MODE_OPTIONS}
          selectedKey={viewModel.angleMode}
          onSelectionChange={(key) => {
            if (key !== null) {
              store.getState().onAngleModeChanged(key as AngleMode);
            }
          }}
        />
      </div>

      <div className={cssClass(styles.settingRow)}>
        <AccessibleSelectComponent
          label="Numeric mode"
          options={numericModeOptions}
          selectedKey={viewModel.numericMode}
          onSelectionChange={(key) => {
            if (key !== null) {
              store.getState().onNumericModeChanged(key as NumericMode);
            }
          }}
        />
      </div>

      <div className={cssClass(styles.settingRow)}>
        <AccessibleSelectComponent
          label="Theme"
          options={THEME_OPTIONS}
          selectedKey={viewModel.themePreference}
          onSelectionChange={(key) => {
            if (key !== null) {
              store.getState().onThemeChanged(key as ThemePreference);
            }
          }}
        />
      </div>

      <div className={cssClass(styles.settingRow)}>
        <AccessibleSwitchComponent
          label="Complex numbers"
          isSelected={viewModel.complexNumbersEnabled}
          onChange={() => store.getState().onComplexNumbersTogglePressed()}
        >
          Enable complex numbers
        </AccessibleSwitchComponent>
      </div>

      <div className={cssClass(styles.settingRow)}>
        <AccessibleSwitchComponent
          label="CAS mode"
          isSelected={viewModel.casEnabled}
          onChange={() => store.getState().onCasTogglePressed()}
        >
          Enable CAS-style symbolic operations
        </AccessibleSwitchComponent>
      </div>

      {!viewModel.bigIntSupported ? (
        <p className={cssClass(styles.warningText)}>
          BigInt is not supported in this browser, so BigInt mode is hidden.
        </p>
      ) : null}
    </div>
  );
}
