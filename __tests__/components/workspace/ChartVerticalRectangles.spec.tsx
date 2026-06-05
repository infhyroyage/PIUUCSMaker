import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartVerticalRectangles from "../../../src/components/workspace/ChartVerticalRectangles";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/workspace/BorderLine", () => ({
  default: () => <div data-testid="border-line" />,
}));

describe("ChartVerticalRectangles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      noteSize: 40,
      zoom: { idx: 0, top: null },
    });
  });
  afterEach(() => cleanup());

  it("renders even block background color", () => {
    // Given: even block props
    const { container } = render(
      <ChartVerticalRectangles
        isEven={true}
        isLastBlock={true}
        rows={4}
        split={2}
      />
    );

    // When: inspecting background
    // Then: even color is applied
    expect(container.firstChild).toHaveStyle({
      backgroundColor: "rgb(255, 255, 170)",
    });
  });

  it("renders beat border lines for non-last blocks", () => {
    // Given: middle block
    const { getAllByTestId } = render(
      <ChartVerticalRectangles
        isEven={false}
        isLastBlock={false}
        rows={4}
        split={2}
      />
    );

    // When: counting border lines
    // Then: beat and block separators are rendered
    expect(getAllByTestId("border-line").length).toBeGreaterThan(0);
  });
});
