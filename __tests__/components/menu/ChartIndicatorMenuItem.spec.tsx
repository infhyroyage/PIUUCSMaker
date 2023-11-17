import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChartIndicatorMenuItem from "../../../src/components/menu/ChartIndicatorMenuItem";

const mockOnClick = jest.fn();

describe("ChartIndicatorMenuItem", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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
