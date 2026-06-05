import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import Chart from "../../../src/components/workspace/Chart";
import { useStore } from "../../../src/hooks/useStore";

const mockSetIndicator = vi.fn();
const mockResetIndicator = vi.fn();
const mockSetHoldSetter = vi.fn();
const mockResetHoldSetter = vi.fn();
const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockPushUndoSnapshot = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockSetSelector = vi.fn();
const mockHideSelector = vi.fn();
const mockSetChartIndicatorMenuPosition = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useVerticalBorderSize", () => ({
  default: () => 4,
}));

vi.mock("../../../src/components/workspace/BorderLine", () => ({
  default: () => <div data-testid="border-line" />,
}));

vi.mock("../../../src/components/workspace/ChartVertical", () => ({
  default: () => <div data-testid="chart-vertical" />,
}));

vi.mock("../../../src/components/workspace/ChartIndicator", () => ({
  default: () => <div data-testid="chart-indicator" />,
}));

vi.mock("../../../src/components/menu/ChartIndicatorMenu", () => ({
  default: () => <div data-testid="chart-indicator-menu" />,
}));

vi.mock("../../../src/components/workspace/ChartSelector", () => ({
  default: () => <div data-testid="chart-selector" />,
}));

const baseBlocks = [
  { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 8, split: 2 },
];

const createStoreMock = (overrides: Record<string, unknown> = {}) => ({
  blocks: baseBlocks,
  chartIndicatorMenuPosition: undefined,
  setChartIndicatorMenuPosition: mockSetChartIndicatorMenuPosition,
  holdSetter: null,
  setHoldSetter: mockSetHoldSetter,
  resetHoldSetter: mockResetHoldSetter,
  indicator: {
    column: 0,
    rowIdx: 0,
    top: 0,
    blockIdx: 0,
    blockAccumulatedRows: 0,
  },
  setIndicator: mockSetIndicator,
  resetIndicator: mockResetIndicator,
  isPlaying: false,
  setIsProtected: mockSetIsProtected,
  notes: [[], [], [], [], []],
  setNotes: mockSetNotes,
  noteSize: 40,
  resetRedoSnapshots: mockResetRedoSnapshots,
  selector: { completed: null, isSettingByMenu: false, setting: null },
  setSelector: mockSetSelector,
  hideSelector: mockHideSelector,
  pushUndoSnapshot: mockPushUndoSnapshot,
  zoom: { idx: 0, top: null },
  ...overrides,
});

describe("Chart", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue(createStoreMock());
  });
  afterEach(() => cleanup());

  it("renders columns with mocked child components", () => {
    // Given: five-column chart
    const { getAllByTestId } = render(<Chart />);

    // When: chart renders
    // Then: vertical columns and overlays are mounted
    expect(getAllByTestId("chart-vertical")).toHaveLength(5);
    expect(getAllByTestId("chart-indicator")).toHaveLength(1);
  });

  const getChartInteractionTarget = (container: HTMLElement) => {
    const vertical = container.querySelector('[data-testid="chart-vertical"]');
    return vertical?.parentElement?.parentElement as HTMLElement;
  };

  it("opens context menu when not playing", () => {
    // Given: chart column area
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: context menu is opened
    fireEvent.contextMenu(target, { clientX: 5, clientY: 6 });

    // Then: menu position is stored
    expect(mockSetChartIndicatorMenuPosition).toHaveBeenCalledWith({
      top: 6,
      left: 5,
    });
  });

  it("adds a single note on click release", () => {
    // Given: hold setter active on same column
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        holdSetter: {
          column: 0,
          rowIdx: 0,
          top: 0,
          isSettingByMenu: false,
        },
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse up on same cell
    fireEvent.mouseUp(target, { button: 0 });

    // Then: note is added and undo snapshot is pushed
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockPushUndoSnapshot).toHaveBeenCalled();
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
  });

  it("updates indicator on mouse move within a block", () => {
    // Given: chart without active indicator
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({ indicator: null })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);
    target.getBoundingClientRect = () =>
      ({ top: 0, left: 0, width: 100, height: 200 }) as DOMRect;

    // When: mouse moves inside block
    fireEvent.mouseMove(target, { clientY: 50 });

    // Then: indicator is updated
    expect(mockSetIndicator).toHaveBeenCalled();
  });

  it("trims surrounding hold when deleting middle hold note", () => {
    // Given: hold chain on column 0
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        holdSetter: {
          column: 0,
          rowIdx: 1,
          top: 40,
          isSettingByMenu: false,
        },
        indicator: {
          column: 0,
          rowIdx: 1,
          top: 40,
          blockIdx: 0,
          blockAccumulatedRows: 0,
        },
        notes: [
          [
            { rowIdx: 0, type: "M" },
            { rowIdx: 1, type: "H" },
            { rowIdx: 2, type: "W" },
          ],
          [],
          [],
          [],
          [],
        ],
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse up on hold middle
    fireEvent.mouseUp(target, { button: 0 });

    // Then: notes are rewritten without the removed segment
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("creates hold notes when dragging across rows", () => {
    // Given: hold setter on row 0 and release on row 2
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        holdSetter: {
          column: 0,
          rowIdx: 0,
          top: 0,
          isSettingByMenu: false,
        },
        indicator: {
          column: 0,
          rowIdx: 2,
          top: 80,
          blockIdx: 0,
          blockAccumulatedRows: 0,
        },
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse up after drag
    fireEvent.mouseUp(target, { button: 0 });

    // Then: hold notes are written
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("removes existing single note on click release", () => {
    // Given: existing note at hold setter position
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        holdSetter: {
          column: 0,
          rowIdx: 0,
          top: 0,
          isSettingByMenu: false,
        },
        notes: [[{ rowIdx: 0, type: "X" }]],
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse up on occupied cell
    fireEvent.mouseUp(target, { button: 0 });

    // Then: note is removed from column
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("starts shift selection on mouse down", () => {
    // Given: indicator without selector
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: shift-click starts selection
    fireEvent.mouseDown(target, { button: 0, shiftKey: true });

    // Then: selector setting is initialized
    expect(mockSetSelector).toHaveBeenCalled();
  });

  it("clears indicator on mouse leave during selection", () => {
    // Given: active selector setting
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        indicator: null,
        selector: {
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: 0,
            mouseDownRowIdx: 0,
            mouseUpColumn: 0,
            mouseUpRowIdx: 0,
          },
        },
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse leaves chart area without shift
    fireEvent.mouseLeave(target, { shiftKey: false });

    // Then: indicator resets and selector clears
    expect(mockResetIndicator).toHaveBeenCalled();
    expect(mockSetSelector).toHaveBeenCalled();
  });

  it("completes selector on mouse up when setting is active", () => {
    // Given: selector drag in progress
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        indicator: {
          column: 0,
          rowIdx: 1,
          top: 40,
          blockIdx: 0,
          blockAccumulatedRows: 0,
        },
        selector: {
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: 0,
            mouseDownRowIdx: 0,
            mouseUpColumn: 1,
            mouseUpRowIdx: 1,
          },
        },
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);

    // When: mouse up completes selection
    fireEvent.mouseUp(target, { button: 0 });

    // Then: completed selector is stored
    expect(mockSetSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: expect.objectContaining({
          startColumn: 0,
          goalColumn: 1,
        }),
      })
    );
  });

  it("updates selector while dragging selection area", () => {
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        indicator: null,
        selector: {
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: 0,
            mouseDownRowIdx: 0,
            mouseUpColumn: 0,
            mouseUpRowIdx: 0,
          },
        },
      })
    );
    const { container } = render(<Chart />);
    const target = getChartInteractionTarget(container);
    target.getBoundingClientRect = () =>
      ({ top: 0, left: 0, width: 100, height: 200 }) as DOMRect;
    fireEvent.mouseMove(target, { clientY: 80 });
    expect(mockSetSelector).toHaveBeenCalled();
  });

  it("hides selector when mouse up leaves chart with incomplete selection", () => {
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        indicator: { column: 0, rowIdx: 0, top: 0, blockIdx: 0, blockAccumulatedRows: 0 },
        selector: {
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: 0,
            mouseDownRowIdx: 0,
            mouseUpColumn: null,
            mouseUpRowIdx: null,
          },
        },
      })
    );
    const { container } = render(<Chart />);
    fireEvent.mouseUp(getChartInteractionTarget(container), { button: 0 });
    expect(mockHideSelector).toHaveBeenCalled();
  });

  it("replaces hold range when notes already exist between start and goal", () => {
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({
        holdSetter: { column: 0, rowIdx: 0, top: 0, isSettingByMenu: false },
        indicator: { column: 0, rowIdx: 2, top: 80, blockIdx: 0, blockAccumulatedRows: 0 },
        notes: [
          [
            { rowIdx: 0, type: "X" },
            { rowIdx: 1, type: "H" },
            { rowIdx: 2, type: "X" },
          ],
          [],
          [],
          [],
          [],
        ],
      })
    );
    const { container } = render(<Chart />);
    fireEvent.mouseUp(getChartInteractionTarget(container), { button: 0 });
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("skips mouse move while playing", () => {
    // Given: playing chart
    (useStore as unknown as Mock).mockReturnValue(
      createStoreMock({ isPlaying: true, indicator: null })
    );
    const { container } = render(<Chart />);
    const column = container.querySelector("div[style*='display: flex'] > div");

    // When: mouse moves over chart
    fireEvent.mouseMove(column as Element, { clientY: 10 });

    // Then: indicator is not updated
    expect(mockSetIndicator).not.toHaveBeenCalled();
  });
});
