import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartSelector from "../../../src/components/workspace/ChartSelector";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useVerticalBorderSize", () => ({
  default: () => 4,
}));

describe("ChartSelector", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      noteSize: 40,
      zoom: { idx: 0, top: null },
      selector: { completed: null, setting: null },
    });
  });
  afterEach(() => cleanup());

  it("renders nothing without completed or setting selection", () => {
    // Given: no selection state
    const { container } = render(<ChartSelector />);

    // When: component renders
    // Then: overlay is absent
    expect(container.firstChild).toBeNull();
  });

  it("renders overlay for completed selection", () => {
    // Given: completed selector
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      noteSize: 40,
      zoom: { idx: 0, top: null },
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
        setting: null,
      },
    });

    // When: component renders
    const { container } = render(<ChartSelector />);

    // Then: selection overlay span exists
    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
