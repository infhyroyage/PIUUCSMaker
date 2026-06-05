import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartVertical from "../../../src/components/workspace/ChartVertical";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/workspace/ChartVerticalRectangles", () => ({
  default: () => <div data-testid="chart-vertical-rectangles" />,
}));

vi.mock("../../../src/components/workspace/ChartVerticalNoteImages", () => ({
  default: () => <div data-testid="chart-vertical-note-images" />,
}));

describe("ChartVertical", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
    });
  });
  afterEach(() => cleanup());

  it("renders rectangles per block and note images for in-range notes", () => {
    // Given: one note inside block range
    const { getByTestId, getAllByTestId } = render(
      <ChartVertical
        blockYDists={[0]}
        column={0}
        notes={[{ rowIdx: 0, type: "X" }]}
      />
    );

    // When: component renders
    // Then: child mocks are present
    expect(getByTestId("chart-vertical-rectangles")).toBeInTheDocument();
    expect(getAllByTestId("chart-vertical-note-images")).toHaveLength(1);
  });

  it("skips notes outside all blocks", () => {
    // Given: note beyond block rows
    const { queryByTestId, getByTestId } = render(
      <ChartVertical
        blockYDists={[0]}
        column={0}
        notes={[{ rowIdx: 99, type: "X" }]}
      />
    );

    // When: component renders
    // Then: rectangles render but note images do not
    expect(getByTestId("chart-vertical-rectangles")).toBeInTheDocument();
    expect(queryByTestId("chart-vertical-note-images")).not.toBeInTheDocument();
  });
});
