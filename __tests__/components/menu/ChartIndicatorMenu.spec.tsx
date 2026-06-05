import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartIndicatorMenu from "../../../src/components/menu/ChartIndicatorMenu";
import { useStore } from "../../../src/hooks/useStore";

const mockResetChartIndicatorMenuPosition = vi.fn();
const mockSetHoldSetter = vi.fn();
const mockSetSelector = vi.fn();
const mockSetBlocks = vi.fn();
const mockSetIndicator = vi.fn();
const mockHandleCopy = vi.fn();
const mockHandleCut = vi.fn();
const mockHandlePaste = vi.fn();
const mockHandleFlip = vi.fn();
const mockHandleDelete = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useClipBoard", () => ({
  default: () => ({
    handleCopy: mockHandleCopy,
    handleCut: mockHandleCut,
    handlePaste: mockHandlePaste,
  }),
}));

vi.mock("../../../src/hooks/useSelectedFlipping", () => ({
  default: () => ({ handleFlip: mockHandleFlip }),
}));

vi.mock("../../../src/hooks/useSelectedDeleting", () => ({
  default: () => ({ handleDelete: mockHandleDelete }),
}));

vi.mock("../../../src/components/menu/MenuBackground", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <button type="button" data-testid="menu-background" onClick={onClose}>
      bg
    </button>
  ),
}));

vi.mock("../../../src/components/menu/MenuItem", () => ({
  default: ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

describe("ChartIndicatorMenu", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      chartIndicatorMenuPosition: { top: 1, left: 2 },
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
      clipBoard: { columnLength: 1, rowLength: 1, copiedNotes: [] },
      holdSetter: null,
      setHoldSetter: mockSetHoldSetter,
      indicator: {
        column: 0,
        rowIdx: 1,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      setIndicator: mockSetIndicator,
      setIsProtected: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      selector: { completed: null, setting: null, isSettingByMenu: false },
      setSelector: mockSetSelector,
      pushUndoSnapshot: vi.fn(),
    });
  });
  afterEach(() => {
    cleanup();
    document.body.style.overflowY = "";
  });

  it("starts hold setting from menu", async () => {
    // Given: open chart indicator menu
    const { getByText } = render(<ChartIndicatorMenu />);

    // When: Start Setting Hold is clicked
    await userEvent.click(getByText("Start Setting Hold"));

    // Then: hold setter is configured and menu closes
    expect(mockSetHoldSetter).toHaveBeenCalled();
    expect(mockResetChartIndicatorMenuPosition).toHaveBeenCalled();
  });

  it("copies selection via menu action", async () => {
    // Given: completed selection
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      chartIndicatorMenuPosition: { top: 1, left: 2 },
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
      clipBoard: null,
      holdSetter: null,
      setHoldSetter: mockSetHoldSetter,
      indicator: {
        column: 0,
        rowIdx: 1,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      setIndicator: mockSetIndicator,
      setIsProtected: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
        setting: null,
        isSettingByMenu: false,
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: vi.fn(),
    });
    const { getByText } = render(<ChartIndicatorMenu />);

    // When: Copy is clicked
    await userEvent.click(getByText("Copy"));

    // Then: clipboard handler runs
    expect(mockHandleCopy).toHaveBeenCalled();
  });

  it("starts selecting and splits block from menu", async () => {
    // Given: open chart menu
    const { getByText } = render(<ChartIndicatorMenu />);

    // When: selecting and split actions run
    await userEvent.click(getByText("Start Selecting"));
    await userEvent.click(getByText("Split Block"));

    // Then: selector and blocks update
    expect(mockSetSelector).toHaveBeenCalled();
    expect(mockSetBlocks).toHaveBeenCalled();
  });

  it("delegates clipboard and transform actions", async () => {
    // Given: completed selection
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      chartIndicatorMenuPosition: { top: 1, left: 2 },
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
      clipBoard: {
        columnLength: 1,
        rowLength: 1,
        copiedNotes: [{ deltaColumn: 0, deltaRowIdx: 0, type: "X" }],
      },
      holdSetter: null,
      setHoldSetter: mockSetHoldSetter,
      indicator: {
        column: 0,
        rowIdx: 1,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      setIndicator: mockSetIndicator,
      setIsProtected: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
        setting: null,
        isSettingByMenu: false,
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: vi.fn(),
    });
    const { getByText } = render(<ChartIndicatorMenu />);

    // When: menu actions are triggered
    await userEvent.click(getByText("Cut"));
    await userEvent.click(getByText("Paste"));
    await userEvent.click(getByText("Flip Horizontal"));
    await userEvent.click(getByText("Mirror"));
    await userEvent.click(getByText("Delete"));

    // Then: delegated handlers run
    expect(mockHandleCut).toHaveBeenCalled();
    expect(mockHandlePaste).toHaveBeenCalled();
    expect(mockHandleFlip).toHaveBeenCalled();
    expect(mockHandleDelete).toHaveBeenCalled();
  });

  it("does not start hold when selector is active", async () => {
    // Given: completed selection blocks hold setup
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      chartIndicatorMenuPosition: { top: 1, left: 2 },
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
      clipBoard: null,
      holdSetter: null,
      setHoldSetter: mockSetHoldSetter,
      indicator: {
        column: 0,
        rowIdx: 1,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      setIndicator: mockSetIndicator,
      setIsProtected: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
        setting: null,
        isSettingByMenu: false,
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: vi.fn(),
    });
    const { getByText } = render(<ChartIndicatorMenu />);
    await userEvent.click(getByText("Start Setting Hold"));
    expect(mockSetHoldSetter).not.toHaveBeenCalled();
  });

  it("closes menu from background click", async () => {
    const { getByTestId } = render(<ChartIndicatorMenu />);
    await userEvent.click(getByTestId("menu-background"));
    expect(mockResetChartIndicatorMenuPosition).toHaveBeenCalled();
  });

  it("handles mac keyboard shortcuts", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Macintosh",
      configurable: true,
    });
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      chartIndicatorMenuPosition: { top: 1, left: 2 },
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
      clipBoard: { columnLength: 1, rowLength: 1, copiedNotes: [] },
      holdSetter: null,
      setHoldSetter: mockSetHoldSetter,
      indicator: {
        column: 0,
        rowIdx: 1,
        top: 10,
        blockIdx: 0,
        blockAccumulatedRows: 0,
      },
      setIndicator: mockSetIndicator,
      setIsProtected: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
        setting: null,
        isSettingByMenu: false,
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: vi.fn(),
    });
    render(<ChartIndicatorMenu />);
    fireEvent.keyDown(window, { key: "c", metaKey: true });
    fireEvent.keyDown(window, { key: "v", metaKey: true });
    fireEvent.keyDown(window, { key: "x", metaKey: true });
    fireEvent.keyDown(window, { key: "backspace" });
    fireEvent.keyDown(window, { key: "y" });
    fireEvent.keyDown(window, { key: "m" });
    expect(mockHandleCopy).toHaveBeenCalled();
    expect(mockHandlePaste).toHaveBeenCalled();
    expect(mockHandleCut).toHaveBeenCalled();
    expect(mockHandleDelete).toHaveBeenCalled();
    expect(mockHandleFlip).toHaveBeenCalled();
  });

  it("handles keyboard shortcut for copy on Windows", () => {
    // Given: menu mounted on non-Mac UA
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Windows",
      configurable: true,
    });
    render(<ChartIndicatorMenu />);

    // When: ctrl+c is pressed
    fireEvent.keyDown(window, { key: "c", ctrlKey: true });

    // Then: copy handler runs
    expect(mockHandleCopy).toHaveBeenCalled();
  });
});
