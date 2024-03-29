import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartIndicatorMenuItem from "../../../src/components/menu/ChartIndicatorMenuItem";

const mockOnClick = vi.fn();

describe("ChartIndicatorMenuItem", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render secondary typography if keyLabel is provided", () => {
    const { queryByText } = render(
      <ChartIndicatorMenuItem label="TestLabel" keyLabel="TestKeyLabel" />
    );

    expect(queryByText("TestKeyLabel")).toBeInTheDocument();
  });

  it("Render correctly if disabled", () => {
    const { getByRole } = render(
      <ChartIndicatorMenuItem
        disabled={true}
        label="TestLabel"
        onClick={() => {}}
      />
    );

    expect(getByRole("menuitem")).toHaveStyle({ "pointer-events": "none" });
  });

  it("Trigger onClick if disabled is not provided", async () => {
    const { getByText } = render(
      <ChartIndicatorMenuItem label="TestLabel" onClick={mockOnClick} />
    );

    await userEvent.click(getByText("TestLabel"));

    await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
  });

  it("Trigger onClick if not disabled", async () => {
    const { getByText } = render(
      <ChartIndicatorMenuItem
        label="TestLabel"
        disabled={false}
        onClick={mockOnClick}
      />
    );

    await userEvent.click(getByText("TestLabel"));

    await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
  });
});
