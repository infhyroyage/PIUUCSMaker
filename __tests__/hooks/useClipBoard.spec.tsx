import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useClipBoard from "../../src/hooks/useClipBoard";
import { useStore } from "../../src/hooks/useStore";

const mockSetClipBoard = vi.fn();
const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockPushUndoSnapshot = vi.fn();
const mockSetSelector = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

const baseBlocks = [
  { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
];

describe("useClipBoard", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does not copy when selection is incomplete", () => {
    // Given: selector without completed area
    (useStore as unknown as Mock).mockReturnValue({
      blocks: baseBlocks,
      clipBoard: null,
      setClipBoard: mockSetClipBoard,
      indicator: null,
      setIsProtected: mockSetIsProtected,
      notes: [[{ rowIdx: 0, type: "X" }]],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: { completed: null },
      setSelector: mockSetSelector,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: copy is requested
    const { result } = renderHook(useClipBoard);
    act(() => result.current.handleCopy());

    // Then: clipboard is untouched
    expect(mockSetClipBoard).not.toHaveBeenCalled();
  });

  it("copies selected notes to clipboard", () => {
    // Given: completed selection
    (useStore as unknown as Mock).mockReturnValue({
      blocks: baseBlocks,
      clipBoard: null,
      setClipBoard: mockSetClipBoard,
      indicator: null,
      setIsProtected: mockSetIsProtected,
      notes: [[{ rowIdx: 0, type: "X" }, { rowIdx: 1, type: "X" }]],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 1,
        },
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: copy runs
    const { result } = renderHook(useClipBoard);
    act(() => result.current.handleCopy());

    // Then: clipboard payload is stored
    expect(mockSetClipBoard).toHaveBeenCalledWith(
      expect.objectContaining({ columnLength: 1, rowLength: 2 })
    );
  });

  it("cuts selected notes after copying", () => {
    // Given: completed selection
    (useStore as unknown as Mock).mockReturnValue({
      blocks: baseBlocks,
      clipBoard: null,
      setClipBoard: mockSetClipBoard,
      indicator: null,
      setIsProtected: mockSetIsProtected,
      notes: [[{ rowIdx: 0, type: "X" }]],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 0,
        },
      },
      setSelector: mockSetSelector,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: cut runs
    const { result } = renderHook(useClipBoard);
    act(() => result.current.handleCut());

    // Then: clipboard is set and notes are cleared in selection
    expect(mockSetClipBoard).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("pastes clipboard at indicator position", () => {
    // Given: clipboard and indicator
    (useStore as unknown as Mock).mockReturnValue({
      blocks: baseBlocks,
      clipBoard: {
        columnLength: 1,
        rowLength: 1,
        copiedNotes: [{ deltaColumn: 0, deltaRowIdx: 0, type: "X" }],
      },
      setClipBoard: mockSetClipBoard,
      indicator: { column: 0, rowIdx: 0, top: 0, blockIdx: 0, blockAccumulatedRows: 0 },
      setIsProtected: mockSetIsProtected,
      notes: [[]],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: { completed: null },
      setSelector: mockSetSelector,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: paste runs
    const { result } = renderHook(useClipBoard);
    act(() => result.current.handlePaste());

    // Then: notes and selector update
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetSelector).toHaveBeenCalled();
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
  });
});
