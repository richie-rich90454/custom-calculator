import { useMemo, useState } from "react";
import { useCalculatorApplicationContext } from "../../app/CalculatorApplicationContext";
import { useCalculatorViewModel } from "../hooks/useCalculatorViewModel";
import { PanelComponent } from "../primitives/PanelComponent";
import { PanelSectionComponent } from "../primitives/PanelSectionComponent";
import { ConstantsPanelCategorySelectorComponent } from "./ConstantsPanelCategorySelectorComponent";
import { ConstantsPanelEmptyStateComponent } from "./ConstantsPanelEmptyStateComponent";
import { ConstantsPanelListItemComponent } from "./ConstantsPanelListItemComponent";
import { ConstantsPanelSearchComponent } from "./ConstantsPanelSearchComponent";
import { ConstantsPanelViewModel } from "../viewmodels/ConstantsPanelViewModel";
import { cssClass } from "../utils/classNames";
import styles from "../styles/ConstantsPanelComponent.module.css";

export function ConstantsPanelComponent() {
  const { store } = useCalculatorApplicationContext();
  const viewModel = useCalculatorViewModel();
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    ConstantsPanelViewModel.ALL_CATEGORIES_ID
  );

  const panelViewModel = useMemo(
    () =>
      new ConstantsPanelViewModel(
        viewModel.constants,
        searchText,
        selectedCategoryId
      ),
    [viewModel.constants, searchText, selectedCategoryId]
  );

  const filteredConstants = panelViewModel.filteredConstants;

  return (
    <PanelComponent title="Constants">
      <PanelSectionComponent heading="Find a constant">
        <ConstantsPanelSearchComponent
          searchText={searchText}
          onSearchTextChanged={setSearchText}
        />
        <ConstantsPanelCategorySelectorComponent
          options={panelViewModel.categoryOptions}
          selectedCategoryId={selectedCategoryId}
          onCategoryChanged={setSelectedCategoryId}
        />
      </PanelSectionComponent>

      <PanelSectionComponent heading="Available constants">
        {filteredConstants.length === 0 ? (
          <ConstantsPanelEmptyStateComponent
            hasSearchQuery={panelViewModel.hasSearchQuery}
          />
        ) : (
          <ul
            className={cssClass(styles.constantList)}
            aria-label="Constants list"
          >
            {filteredConstants.map((constant) => (
              <ConstantsPanelListItemComponent
                key={constant.id}
                constant={constant}
                onInsert={(constantId) =>
                  store.getState().onConstantPressed(constantId)
                }
              />
            ))}
          </ul>
        )}
      </PanelSectionComponent>
    </PanelComponent>
  );
}
