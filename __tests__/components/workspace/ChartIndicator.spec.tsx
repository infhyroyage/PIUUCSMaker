import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartIndicator from "../../../src/components/workspace/ChartIndicator";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useVerticalBorderSize", () => ({
  default: () => 4,
}));

describe("ChartIndicator", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      holdSetter: null,
      indicator: null,
      noteSize: 40,
      selector: { isSettingByMenu: false },
    });
  });
  afterEach(() => cleanup());

  it("renders nothing when indicator is null", () => {
    // Given: no indicator
    const { container } = render(<ChartIndicator />);

    // When: component renders
    // Then: output is empty
    expect(container.firstChild).toBeNull();
  });

  it("renders highlight span when indicator exists", () => {
    // Given: active indicator
    (useStore as unknown as Mock).mockReturnValue({
      holdSetter: null,
      indicator: {
        column: 0,
        rowIdx: 0,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      noteSize: 40,
      selector: { isSettingByMenu: false },
    });

    // When: component renders
    const { container } = render(<ChartIndicator />);

    // Then: highlight span is present
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders hold preview images when holdSetter differs in row", () => {
    // Given: hold setter on same column
    (useStore as unknown as Mock).mockReturnValue({
      holdSetter: {
        column: 0,
        rowIdx: 0,
        top: 0,
        isSettingByMenu: true,
      },
      indicator: {
        column: 0,
        rowIdx: 2,
        top: 40,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      noteSize: 40,
      selector: { isSettingByMenu: false },
    });

    // When: component renders
    const { getAllByRole } = render(<ChartIndicator />);

    // Then: hold preview images appear
    expect(getAllByRole("img").length).toBeGreaterThan(0);
  });
});
