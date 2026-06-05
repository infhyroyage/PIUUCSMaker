import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useSelectedFlipping from "../../src/hooks/useSelectedFlipping";
import { useStore } from "../../src/hooks/useStore";

const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockPushUndoSnapshot = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useSelectedFlipping", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does nothing when selector.completed is null", () => {
    // Given: no completed selection
    (useStore as unknown as Mock).mockReturnValue({
      notes: [[{ rowIdx: 0, type: "X" }]],
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: { completed: null },
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: flip is requested
    const { result } = renderHook(useSelectedFlipping);
    act(() => result.current.handleFlip(true, false));

    // Then: notes are not updated
    expect(mockSetNotes).not.toHaveBeenCalled();
  });

  it("flips notes vertically within selection", () => {
    // Given: selection on lane 0
    (useStore as unknown as Mock).mockReturnValue({
      notes: [[{ rowIdx: 0, type: "X" }], [], [], [], []],
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 0,
        },
      },
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: vertical flip runs
    const { result } = renderHook(useSelectedFlipping);
    act(() => result.current.handleFlip(false, true));

    // Then: notes update
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("flips notes horizontally within selection", () => {
    // Given: two-column selection on a single-column chart width 2
    (useStore as unknown as Mock).mockReturnValue({
      notes: [
        [{ rowIdx: 0, type: "X" }],
        [{ rowIdx: 0, type: "M" }],
      ],
      setNotes: mockSetNotes,
      setIsProtected: mockSetIsProtected,
      resetRedoSnapshots: mockResetRedoSnapshots,
      selector: {
        completed: {
          startColumn: 0,
          goalColumn: 1,
          startRowIdx: 0,
          goalRowIdx: 0,
        },
      },
      pushUndoSnapshot: mockPushUndoSnapshot,
    });

    // When: horizontal flip runs
    const { result } = renderHook(useSelectedFlipping);
    act(() => result.current.handleFlip(true, false));

    // Then: notes swap columns and protection updates
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
    expect(mockResetRedoSnapshots).toHaveBeenCalled();
    expect(mockPushUndoSnapshot).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
  });
});
