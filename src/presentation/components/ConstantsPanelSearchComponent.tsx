import { AccessibleTextFieldComponent } from "../primitives/AccessibleTextFieldComponent";

interface ConstantsPanelSearchComponentProperties {
  readonly searchText: string;
  readonly onSearchTextChanged: (searchText: string) => void;
}

export function ConstantsPanelSearchComponent(
  props: ConstantsPanelSearchComponentProperties
) {
  return (
    <AccessibleTextFieldComponent
      label="Search constants"
      value={props.searchText}
      onChange={props.onSearchTextChanged}
    />
  );
}
