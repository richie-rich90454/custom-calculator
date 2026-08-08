import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { useKeypadGridNavigation } from "./useKeypadGridNavigation";

function EmptyGridProbe() {
    const navigation = useKeypadGridNavigation([], 4);

    return (
        <div role="grid" tabIndex={-1} onKeyDown={navigation.handleGridKeyDown}>
            empty
        </div>
    );
}

function SingleRowGridProbe() {
    const itemIds = ["a", "b", "c", "d"];
    const navigation = useKeypadGridNavigation(itemIds, 4);

    return (
        <div role="grid" tabIndex={-1} onKeyDown={navigation.handleGridKeyDown}>
            {itemIds.map((id) => (
                <button
                    key={id}
                    ref={(el) => navigation.registerItemRef(id, el)}
                    onFocus={() => navigation.handleItemFocus(id)}
                >
                    {id}
                </button>
            ))}
        </div>
    );
}

describe("useKeypadGridNavigation", () => {
    it("ignores grid key events when the grid has no items", async () => {
        const user = userEvent.setup();

        render(<EmptyGridProbe />);

        const grid = screen.getByRole("grid");

        grid.focus();
        await user.keyboard("{ArrowRight}");

        expect(screen.getByText("empty")).toBeInTheDocument();
    });

    it("ignores non arrow keys entirely", async () => {
        const user = userEvent.setup();

        render(<SingleRowGridProbe />);

        const firstButton = screen.getByRole("button", { name: "a" });

        firstButton.focus();
        await user.keyboard("a");

        expect(firstButton).toHaveFocus();
    });

    it("keeps focus within the grid on arrow key boundaries", async () => {
        const user = userEvent.setup();

        render(<SingleRowGridProbe />);

        const lastButton = screen.getByRole("button", { name: "d" });

        lastButton.focus();
        await user.keyboard("{ArrowRight}");
        expect(lastButton).toHaveFocus();

        await user.keyboard("{ArrowDown}");
        expect(lastButton).toHaveFocus();

        const firstButton = screen.getByRole("button", { name: "a" });

        firstButton.focus();
        await user.keyboard("{ArrowLeft}");
        expect(firstButton).toHaveFocus();

        await user.keyboard("{ArrowUp}");
        expect(firstButton).toHaveFocus();
    });
});
