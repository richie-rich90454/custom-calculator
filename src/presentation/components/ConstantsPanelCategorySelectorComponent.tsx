import {
  AccessibleSelectComponent,
  type AccessibleSelectOption,
} from "../primitives/AccessibleSelectComponent";
import type { ConstantsPanelCategoryOption } from "../viewmodels/ConstantsPanelViewModel";

interface ConstantsPanelCategorySelectorComponentProperties {
  readonly options: readonly ConstantsPanelCategoryOption[];
  readonly selectedCategoryId: string;
  readonly onCategoryChanged: (categoryId: string) => void;
}

export function ConstantsPanelCategorySelectorComponent(
  props: ConstantsPanelCategorySelectorComponentProperties
) {
  const selectOptions: readonly AccessibleSelectOption[] = props.options.map(
    (option) => ({
      id: option.id,
      label: option.label,
    })
  );

  return (
    <AccessibleSelectComponent
      label="Constant category"
      options={selectOptions}
      selectedKey={props.selectedCategoryId}
      onSelectionChange={(key) => {
        if (key !== null) {
          props.onCategoryChanged(String(key));
        }
      }}
    />
  );
}
