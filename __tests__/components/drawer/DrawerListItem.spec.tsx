import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DrawerListItem from "../../../src/components/drawer/DrawerListItem";

describe("DrawerListItem", () => {
  afterEach(() => cleanup());

  it("renders label and triggers onClick when enabled", async () => {
    // Given: enabled drawer item
    const onClick = vi.fn();
    const { getByRole, getByText } = render(
      <DrawerListItem
        disabled={false}
        icon={<span data-testid="icon" />}
        label="Test Item"
        onClick={onClick}
      />
    );

    // When: user clicks the button
    await userEvent.click(getByRole("button"));

    // Then: label is visible and handler runs
    expect(getByText("Test Item")).toBeInTheDocument();
    expect(onClick).toHaveBeenCalled();
  });

  it("disables the button when disabled is true", () => {
    // Given: disabled drawer item
    const { getByRole } = render(
      <DrawerListItem
        disabled={true}
        icon={<span />}
        label="Disabled"
        onClick={() => {}}
      />
    );

    // When: inspecting the button
    // Then: it is disabled
    expect(getByRole("button")).toBeDisabled();
  });
});
