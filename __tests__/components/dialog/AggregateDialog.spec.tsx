import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { AggregateDialog } from "../../../src/components/dialog/AggregateDialog";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("AggregateDialog", () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => cleanup());

  it("shows skeleton when no notes exist", () => {
    // Given: empty chart
    (useStore as unknown as Mock).mockReturnValue({
      notes: [],
      noteSize: 40,
    });

    // When: dialog renders
    const { getAllByTestId, getByTestId } = render(<AggregateDialog />);

    // When/Then: skeleton placeholders are shown
    expect(getByTestId("aggregate-dialog")).toBeInTheDocument();
    expect(getAllByTestId("aggregate-dialog").length).toBe(1);
    expect(document.querySelectorAll(".skeleton").length).toBeGreaterThan(0);
  });

  it("shows combo counts and percentages", () => {
    // Given: notes on two rows in one column
    (useStore as unknown as Mock).mockReturnValue({
      notes: [
        [
          { rowIdx: 0, type: "X" },
          { rowIdx: 1, type: "X" },
        ],
        [],
        [],
        [],
        [],
      ],
      noteSize: 40,
    });

    // When: dialog renders
    const { getByText } = render(<AggregateDialog />);

    // Then: total combo and column stats appear
    expect(getByText("Total Combo:")).toBeInTheDocument();
    expect(getByText("100%")).toBeInTheDocument();
  });
});
