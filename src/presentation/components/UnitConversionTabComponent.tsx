import { useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { AccessibleSelectComponent } from "../primitives/AccessibleSelectComponent";
import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";
import { cssClass } from "../utils/classNames";
import type { TemperatureUnit } from "../../application/services/TemperatureConversionPolicy";
import styles from "../styles/UnitConversionTabComponent.module.css";

interface UnitCategoryDefinition {
    readonly id: string;
    readonly name: string;
    readonly units: readonly {
        readonly label: string;
        readonly mathjs: string;
        readonly temperature?: TemperatureUnit;
    }[];
}

const UNIT_CATEGORIES: readonly UnitCategoryDefinition[] = [
    {
        id: "length",
        name: "Length",
        units: [
            { label: "m", mathjs: "m" },
            { label: "cm", mathjs: "cm" },
            { label: "mm", mathjs: "mm" },
            { label: "km", mathjs: "km" },
            { label: "in", mathjs: "inch" },
            { label: "ft", mathjs: "foot" },
            { label: "yd", mathjs: "yard" },
            { label: "mi", mathjs: "mile" },
        ],
    },
    {
        id: "mass",
        name: "Mass",
        units: [
            { label: "g", mathjs: "g" },
            { label: "kg", mathjs: "kg" },
            { label: "mg", mathjs: "mg" },
            { label: "lb", mathjs: "lb" },
            { label: "oz", mathjs: "oz" },
            { label: "t", mathjs: "tonne" },
        ],
    },
    {
        id: "temperature",
        name: "Temperature",
        units: [
            { label: "C", mathjs: "degC", temperature: "C" },
            { label: "F", mathjs: "degF", temperature: "F" },
            { label: "K", mathjs: "degK", temperature: "K" },
            { label: "R", mathjs: "degR", temperature: "R" },
        ],
    },
    {
        id: "pressure",
        name: "Pressure",
        units: [
            { label: "Pa", mathjs: "Pa" },
            { label: "kPa", mathjs: "kPa" },
            { label: "bar", mathjs: "bar" },
            { label: "atm", mathjs: "atm" },
            { label: "mmHg", mathjs: "mmHg" },
            { label: "psi", mathjs: "psi" },
        ],
    },
    {
        id: "energy",
        name: "Energy",
        units: [
            { label: "J", mathjs: "J" },
            { label: "kJ", mathjs: "kJ" },
            { label: "cal", mathjs: "cal" },
            { label: "kcal", mathjs: "kcal" },
            { label: "Wh", mathjs: "Wh" },
            { label: "kWh", mathjs: "kWh" },
            { label: "eV", mathjs: "eV" },
        ],
    },
    {
        id: "power",
        name: "Power",
        units: [
            { label: "W", mathjs: "W" },
            { label: "kW", mathjs: "kW" },
            { label: "MW", mathjs: "MW" },
            { label: "hp", mathjs: "hp" },
        ],
    },
    {
        id: "force",
        name: "Force",
        units: [
            { label: "N", mathjs: "N" },
            { label: "kN", mathjs: "kN" },
            { label: "kgf", mathjs: "kgf" },
            { label: "lbf", mathjs: "lbf" },
            { label: "dyn", mathjs: "dyne" },
        ],
    },
    {
        id: "time",
        name: "Time",
        units: [
            { label: "s", mathjs: "s" },
            { label: "ms", mathjs: "ms" },
            { label: "min", mathjs: "min" },
            { label: "h", mathjs: "hour" },
            { label: "day", mathjs: "day" },
        ],
    },
    {
        id: "area",
        name: "Area",
        units: [
            { label: "m^2", mathjs: "m^2" },
            { label: "cm^2", mathjs: "cm^2" },
            { label: "km^2", mathjs: "km^2" },
            { label: "ha", mathjs: "ha" },
            { label: "acre", mathjs: "acre" },
            { label: "ft^2", mathjs: "ft^2" },
        ],
    },
    {
        id: "volume",
        name: "Volume",
        units: [
            { label: "L", mathjs: "l" },
            { label: "mL", mathjs: "ml" },
            { label: "m^3", mathjs: "m^3" },
            { label: "cm^3", mathjs: "cm^3" },
            { label: "gal", mathjs: "gal" },
            { label: "fl oz", mathjs: "floz" },
        ],
    },
    {
        id: "speed",
        name: "Speed",
        units: [
            { label: "m/s", mathjs: "m/s" },
            { label: "km/h", mathjs: "km/h" },
            { label: "mph", mathjs: "mph" },
            { label: "knot", mathjs: "knot" },
            { label: "ft/s", mathjs: "ft/s" },
        ],
    },
    {
        id: "angle",
        name: "Angle",
        units: [
            { label: "deg", mathjs: "deg" },
            { label: "rad", mathjs: "rad" },
            { label: "gon", mathjs: "gon" },
        ],
    },
];

export function UnitConversionTabComponent() {
    const { compositionRoot } = useCalculatorApplicationContext();
    const [categoryId, setCategoryId] = useState<string>("length");
    const [fromUnitId, setFromUnitId] = useState<string>("m");
    const [toUnitId, setToUnitId] = useState<string>("cm");
    const [valueText, setValueText] = useState<string>("1");
    const [resultText, setResultText] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);

    const category = UNIT_CATEGORIES.find((candidate) => candidate.id === categoryId)!;

    const changeCategory = (nextCategoryId: string): void => {
        const nextCategory = UNIT_CATEGORIES.find((candidate) => candidate.id === nextCategoryId)!;
        setCategoryId(nextCategory.id);
        setFromUnitId(nextCategory.units[0]!.mathjs);
        setToUnitId(nextCategory.units[1]!.mathjs);
        setResultText(null);
        setErrorText(null);
    };

    const convert = (): void => {
        const value = Number(valueText);

        if (valueText.trim() === "" || Number.isNaN(value)) {
            setResultText(null);
            setErrorText("Enter a numeric value to convert.");
            return;
        }

        const from = category.units.find((unit) => unit.mathjs === fromUnitId)!;
        const to = category.units.find((unit) => unit.mathjs === toUnitId)!;

        let convertedValue: number;

        if (
            category.id === "temperature" &&
            from.temperature !== undefined &&
            to.temperature !== undefined
        ) {
            convertedValue = compositionRoot.temperatureConversionPolicy.convert(
                value,
                from.temperature,
                to.temperature,
            );
        } else {
            convertedValue = compositionRoot.unitConversionGateway.convert(
                value,
                from.mathjs,
                to.mathjs,
            ).value;
        }

        setResultText(`${round(convertedValue)} ${to.label}`);
        setErrorText(null);
    };

    return (
        <div className={cssClass(styles.app)}>
            <div className={cssClass(styles.controlsRow)}>
                <AccessibleSelectComponent
                    label="Unit category"
                    selectedKey={categoryId}
                    options={UNIT_CATEGORIES.map((candidate) => ({
                        id: candidate.id,
                        label: candidate.name,
                    }))}
                    onSelectionChange={(key) => changeCategory(key as string)}
                />
                <AccessibleSelectComponent
                    label="From unit"
                    selectedKey={fromUnitId}
                    options={category.units.map((unit) => ({ id: unit.mathjs, label: unit.label }))}
                    onSelectionChange={(key) => setFromUnitId(key as string)}
                />
                <AccessibleSelectComponent
                    label="To unit"
                    selectedKey={toUnitId}
                    options={category.units.map((unit) => ({ id: unit.mathjs, label: unit.label }))}
                    onSelectionChange={(key) => setToUnitId(key as string)}
                />
                <AccessibleTextFieldComponent
                    label="Value to convert"
                    value={valueText}
                    inputMode="decimal"
                    onChange={setValueText}
                />
            </div>

            <div className={cssClass(styles.actionGroup)}>
                <AccessibleButtonComponent
                    customClassName={cssClass(styles.actionButton)}
                    aria-label="Convert the value"
                    onPress={convert}
                >
                    Convert
                </AccessibleButtonComponent>
            </div>

            <div className={cssClass(styles.statusArea)} role="status">
                {resultText !== null ? (
                    <p className={cssClass(styles.resultLine)}>{resultText}</p>
                ) : null}
                {errorText !== null ? (
                    <p className={cssClass(styles.errorLine)}>{errorText}</p>
                ) : null}
            </div>
        </div>
    );
}

function round(value: number): number {
    return Math.round(value * 1e10) / 1e10;
}
