import type { ReactNode } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  type TabsProps,
} from "react-aria-components";
import styles from "../styles/AccessibleTabsComponent.module.css";

export interface AccessibleTabDefinition {
  readonly id: string;
  readonly label: string;
}

export interface AccessibleTabsComponentProperties
  extends Omit<TabsProps, "className"> {
  readonly tabs: readonly AccessibleTabDefinition[];
  readonly children: ReactNode;
}

export function AccessibleTabsComponent(
  props: AccessibleTabsComponentProperties
) {
  const { tabs, children, ...tabsProperties } = props;

  return (
    <Tabs {...tabsProperties} className={styles.tabs}>
      <TabList className={styles.tabList}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className={styles.tab}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanel className={styles.tabPanel}>{children}</TabPanel>
    </Tabs>
  );
}
