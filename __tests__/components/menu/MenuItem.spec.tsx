import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MenuItem from "../../../src/components/menu/MenuItem";

const mockOnClick = vi.fn();

describe("MenuItem", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render secondary typography if keyLabel is provided", () => {
    const { queryByText } = render(
      <MenuItem label="TestLabel" keyLabel="TestKeyLabel" />
    );

    expect(queryByText("TestKeyLabel")).toBeInTheDocument();
  });

  it("Render correctly if disabled", () => {
    const { getByRole } = render(
      <MenuItem disabled={true} label="TestLabel" onClick={() => {}} />
    );

    expect(getByRole("menuitem")).toHaveStyle({ "pointer-events": "none" });
  });

  it("Trigger onClick if disabled is not provided", async () => {
    const { getByText } = render(
      <MenuItem label="TestLabel" onClick={mockOnClick} />
    );

    await userEvent.click(getByText("TestLabel"));

    await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
  });

  it("Trigger onClick if not disabled", async () => {
    const { getByText } = render(
      <MenuItem label="TestLabel" disabled={false} onClick={mockOnClick} />
    );

    await userEvent.click(getByText("TestLabel"));

    await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
  });
});
