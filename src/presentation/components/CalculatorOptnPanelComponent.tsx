import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { AngleMode } from "../../domain/model/AngleMode";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { AccessibleButtonComponent } from "../primitives/AccessibleButtonComponent";
import { ConstantsPanelComponent } from "./ConstantsPanelComponent";
import { cssClass, joinClassNames } from "../utils/classNames";
import styles from "../styles/CalculatorOptnPanelComponent.module.css";

/**
 * OPTN options catalog with tabs for constants, angle mode, and display
 * format. Unit conversion joins this catalog in a later phase.
 */
export function CalculatorOptnPanelComponent() {
    const { store } = useCalculatorApplicationContext();
    const viewModel = useCalculatorViewModel();

    return (
        <Tabs className={cssClass(styles.tabs)} defaultSelectedKey="constants">
            <TabList className={cssClass(styles.tabList)} aria-label="Options catalog tabs">
                <Tab id="constants" className={cssClass(styles.tab)}>
                    Constants
                </Tab>
                <Tab id="angle" className={cssClass(styles.tab)}>
                    Angle Mode
                </Tab>
                <Tab id="format" className={cssClass(styles.tab)}>
                    Display Format
                </Tab>
            </TabList>
            <TabPanel id="constants" className={cssClass(styles.tabPanel)}>
                <ConstantsPanelComponent />
            </TabPanel>
            <TabPanel id="angle" className={cssClass(styles.tabPanel)}>
                <div className={cssClass(styles.optionGroup)}>
                    <h3 className={cssClass(styles.optionHeading)}>Angle unit</h3>
                    {(
                        [
                            [AngleMode.DEG, "DEG", "degrees"],
                            [AngleMode.RAD, "RAD", "radians"],
                            [AngleMode.GON, "GON", "gons"],
                        ] as const
                    ).map(([angleMode, label, name]) => (
                        <AccessibleButtonComponent
                            key={angleMode}
                            customClassName={joinClassNames(
                                styles.optionButton,
                                viewModel.angleMode === angleMode
                                    ? styles.optionButtonActive
                                    : undefined,
                            )}
                            aria-label={`Use ${name}`}
                            aria-pressed={viewModel.angleMode === angleMode}
                            onPress={() => store.getState().onAngleModeChanged(angleMode)}
                        >
                            {label}
                        </AccessibleButtonComponent>
                    ))}
                </div>
            </TabPanel>
            <TabPanel id="format" className={cssClass(styles.tabPanel)}>
                <div className={cssClass(styles.optionGroup)}>
                    <h3 className={cssClass(styles.optionHeading)}>Number format</h3>
                    {viewModel.supportedNumericModes.map((numericMode) => (
                        <AccessibleButtonComponent
                            key={numericMode}
                            customClassName={joinClassNames(
                                styles.optionButton,
                                viewModel.numericMode === numericMode
                                    ? styles.optionButtonActive
                                    : undefined,
                            )}
                            aria-label={`Use ${numericMode} number format`}
                            aria-pressed={viewModel.numericMode === numericMode}
                            onPress={() => store.getState().onNumericModeChanged(numericMode)}
                        >
                            {numericMode.replace("_", " ")}
                        </AccessibleButtonComponent>
                    ))}
                </div>
            </TabPanel>
        </Tabs>
    );
}
