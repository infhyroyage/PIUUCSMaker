import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useSelectedDeleting from "../../src/hooks/useSelectedDeleting";
import { useStore } from "../../src/hooks/useStore";

const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockPushUndoSnapshot = vi.fn();
vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useSelectedDeleting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("Do nothing if selector.completed is null", () => {
    (useStore as unknown as Mock).mockReturnValue({
      notes: [],
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: { completed: null },
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    const { result } = renderHook(useSelectedDeleting);
    const { handleDelete } = result.current;
    act(() => handleDelete());

    expect(mockSetNotes).not.toHaveBeenCalled();
    expect(mockSetIsProtected).not.toHaveBeenCalled();
    expect(mockResetRedoSnapshots).not.toHaveBeenCalled();
    expect(mockPushUndoSnapshot).not.toHaveBeenCalled();
  });

  it("Delete notes only with selected area", () => {
    (useStore as unknown as Mock).mockReturnValue({
      notes: Array(5).fill(
        [...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" }))
      ),
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: {
        completed: {
          goalColumn: 3,
          goalRowIdx: 2,
          startColumn: 1,
          startRowIdx: 1,
        },
      },
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    const { result } = renderHook(useSelectedDeleting);
    const { handleDelete } = result.current;
    act(() => {
      handleDelete();
    });

    expect(mockSetNotes).toHaveBeenCalledWith([
      [...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" })),
      [
        { rowIdx: 0, type: "X" },
        { rowIdx: 3, type: "X" },
      ],
      [
        { rowIdx: 0, type: "X" },
        { rowIdx: 3, type: "X" },
      ],
      [
        { rowIdx: 0, type: "X" },
        { rowIdx: 3, type: "X" },
      ],
      [...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" })),
    ]);
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
    expect(mockResetRedoSnapshots).toHaveBeenCalled();
    expect(mockPushUndoSnapshot).toHaveBeenCalledWith({
      blocks: null,
      notes: Array(5).fill(
        [...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" }))
      ),
    });
  });
});
