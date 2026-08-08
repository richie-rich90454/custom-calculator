import { PanelEmptyStateComponent } from "../primitives/PanelEmptyStateComponent";

interface ConstantsPanelEmptyStateComponentProperties {
  readonly hasSearchQuery: boolean;
}

export function ConstantsPanelEmptyStateComponent(
  props: ConstantsPanelEmptyStateComponentProperties
) {
  const message = props.hasSearchQuery
    ? "No constants match your search."
    : "No constants are available.";

  return <PanelEmptyStateComponent message={message} />;
}
