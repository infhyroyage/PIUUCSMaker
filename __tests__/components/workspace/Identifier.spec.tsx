import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import Identifier from "../../../src/components/workspace/Identifier";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/workspace/BorderLine", () => ({
  default: ({ style }: { style?: React.CSSProperties }) => (
    <div data-testid="border-line" style={style} />
  ),
}));

describe("Identifier", () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => cleanup());

  it("renders measure labels for blocks", () => {
    // Given: one chart block
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      noteSize: 40,
      zoom: { idx: 0, top: null },
    });

    // When: identifier renders
    const { getByText } = render(<Identifier />);

    // Then: block/measure label is shown
    expect(getByText("1: 1")).toBeInTheDocument();
  });

  it("renders border lines between multiple blocks", () => {
    // Given: two blocks
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
        { accumulatedRows: 4, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      noteSize: 40,
      zoom: { idx: 0, top: null },
    });

    // When: identifier renders
    const { getAllByTestId } = render(<Identifier />);

    // Then: block separator border lines exist
    expect(getAllByTestId("border-line").length).toBeGreaterThan(0);
  });
});
