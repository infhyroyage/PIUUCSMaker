import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSelectedDeleting from "../../src/hooks/useSelectedDeleting";

const mockSetNotes = vi.fn();
const mockSetUndoSnapshots = vi.fn();
const mockSetIsProtected = vi.fn();
const mockSetRedoSnapshots = vi.fn();
vi.mock("recoil", async () => ({
  ...(await vi.importActual("recoil")),
  useRecoilState: vi.fn(),
  useRecoilValue: vi.fn(),
  useSetRecoilState: vi.fn(),
}));

describe("useSelectedDeleting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("Do nothing if selector.completed is null", () => {
    (useRecoilState as Mock).mockReturnValueOnce([[], mockSetNotes]);
    (useRecoilState as Mock).mockReturnValueOnce([[], mockSetUndoSnapshots]);
    (useRecoilValue as Mock).mockReturnValueOnce({ completed: null });
    (useSetRecoilState as Mock).mockReturnValueOnce(mockSetIsProtected);
    (useSetRecoilState as Mock).mockReturnValueOnce(mockSetRedoSnapshots);

    const { result } = renderHook(useSelectedDeleting);
    const { handleDelete } = result.current;
    act(() => handleDelete());

    expect(mockSetIsProtected).not.toHaveBeenCalled();
    expect(mockSetNotes).not.toHaveBeenCalled();
    expect(mockSetUndoSnapshots).not.toHaveBeenCalled();
    expect(mockSetRedoSnapshots).not.toHaveBeenCalled();
  });

  it("Delete notes only with selected area", () => {
    (useRecoilState as Mock).mockReturnValueOnce([
      Array(5).fill([...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" }))),
      mockSetNotes,
    ]);
    (useRecoilState as Mock).mockReturnValueOnce([
      [
        {
          blocks: [
            {
              accumulatedRows: 0,
              beat: 4,
              bpm: 120,
              delay: 0,
              rows: 50,
              split: 2,
            },
          ],
          notes: null,
        },
      ],
      mockSetUndoSnapshots,
    ]);
    (useRecoilValue as Mock).mockReturnValueOnce({
      completed: {
        goalColumn: 3,
        goalRowIdx: 2,
        startColumn: 1,
        startRowIdx: 1,
      },
    });
    (useSetRecoilState as Mock).mockReturnValueOnce(mockSetIsProtected);
    (useSetRecoilState as Mock).mockReturnValueOnce(mockSetRedoSnapshots);

    const { result } = renderHook(useSelectedDeleting);
    const { handleDelete } = result.current;
    act(() => {
      handleDelete();
    });

    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
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
    expect(mockSetUndoSnapshots).toHaveBeenCalledWith([
      {
        blocks: [
          {
            accumulatedRows: 0,
            beat: 4,
            bpm: 120,
            delay: 0,
            rows: 50,
            split: 2,
          },
        ],
        notes: null,
      },
      {
        blocks: null,
        notes: Array(5).fill(
          [...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" }))
        ),
      },
    ]);
    expect(mockSetRedoSnapshots).toHaveBeenCalledWith([]);
  });
});
