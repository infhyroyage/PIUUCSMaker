import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useChartSnapshot from "../../src/hooks/useChartSnapshot";
import { useStore } from "../../src/hooks/useStore";

vi.mock("../../src/hooks/useNewUcsDialog", () => ({
  default: () => ({ isOpenedNewUCSDialog: false }),
}));

vi.mock("../../src/hooks/useEditBlockDialog", () => ({
  default: () => ({ isOpenedEditBlockDialog: false }),
}));

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockPopUndoSnapshot = vi.fn();
const mockPopRedoSnapshot = vi.fn();
const mockPushUndoSnapshot = vi.fn();
const mockPushRedoSnapshot = vi.fn();
const mockResetIndicator = vi.fn();
const mockHideSelector = vi.fn();
const mockResetBlockControllerMenuPosition = vi.fn();
const mockResetChartIndicatorMenuPosition = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useChartSnapshot", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does not undo when stack is empty", () => {
    // Given: empty undo stack
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [],
      notes: [],
      undoSnapshots: [],
      redoSnapshots: [],
      popUndoSnapshot: mockPopUndoSnapshot,
      pushRedoSnapshot: mockPushRedoSnapshot,
      popRedoSnapshot: mockPopRedoSnapshot,
      pushUndoSnapshot: mockPushUndoSnapshot,
      setBlocks: mockSetBlocks,
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetIndicator: mockResetIndicator,
      hideSelector: mockHideSelector,
      resetBlockControllerMenuPosition: mockResetBlockControllerMenuPosition,
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
    });

    // When: undo is requested
    const { result } = renderHook(useChartSnapshot);
    act(() => result.current.handleUndo());

    // Then: snapshot pop is not called
    expect(mockPopUndoSnapshot).not.toHaveBeenCalled();
  });

  it("applies redo snapshot when stack is available", () => {
    // Given: redo snapshot available
    mockPopRedoSnapshot.mockReturnValue({
      blocks: null,
      notes: [[{ rowIdx: 0, type: "M" }]],
    });
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [],
      notes: [[]],
      undoSnapshots: [],
      redoSnapshots: [{}],
      popUndoSnapshot: mockPopUndoSnapshot,
      pushRedoSnapshot: mockPushRedoSnapshot,
      popRedoSnapshot: mockPopRedoSnapshot,
      pushUndoSnapshot: mockPushUndoSnapshot,
      setBlocks: mockSetBlocks,
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetIndicator: mockResetIndicator,
      hideSelector: mockHideSelector,
      resetBlockControllerMenuPosition: mockResetBlockControllerMenuPosition,
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
    });

    // When: redo runs
    const { result } = renderHook(useChartSnapshot);
    act(() => result.current.handleRedo());

    // Then: redo snapshot is applied
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("applies undo snapshot and updates protection", () => {
    // Given: one undo snapshot remaining
    mockPopUndoSnapshot.mockReturnValue({
      blocks: [{ accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 2, split: 2 }],
      notes: [[]],
    });
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [],
      notes: [[]],
      undoSnapshots: [{}],
      redoSnapshots: [],
      popUndoSnapshot: mockPopUndoSnapshot,
      pushRedoSnapshot: mockPushRedoSnapshot,
      popRedoSnapshot: mockPopRedoSnapshot,
      pushUndoSnapshot: mockPushUndoSnapshot,
      setBlocks: mockSetBlocks,
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetIndicator: mockResetIndicator,
      hideSelector: mockHideSelector,
      resetBlockControllerMenuPosition: mockResetBlockControllerMenuPosition,
      resetChartIndicatorMenuPosition: mockResetChartIndicatorMenuPosition,
    });

    // When: undo runs
    const { result } = renderHook(useChartSnapshot);
    act(() => result.current.handleUndo());

    // Then: state is restored and UI resets
    expect(mockSetIsProtected).toHaveBeenCalledWith(false);
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockHideSelector).toHaveBeenCalled();
  });
});
