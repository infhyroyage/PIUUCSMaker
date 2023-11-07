import { act, renderHook, waitFor } from "@testing-library/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSelectedDeleting from "../../src/hooks/useSelectedDeleting";

const mockSetNotes = jest.fn();
const mockSetUndoSnapshots = jest.fn();
const mockSetIsProtected = jest.fn();
const mockSetRedoSnapshots = jest.fn();
jest.mock("recoil", () => ({
  ...jest.requireActual("recoil"),
  useRecoilState: jest.fn(),
  useRecoilValue: jest.fn(),
  useSetRecoilState: jest.fn(),
}));

describe("useSelectedDeleting", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Do nothing if selector.completed is null", () => {
    (useRecoilState as jest.Mock).mockReturnValueOnce([[], mockSetNotes]);
    (useRecoilState as jest.Mock).mockReturnValueOnce([
      [],
      mockSetUndoSnapshots,
    ]);
    (useRecoilValue as jest.Mock).mockReturnValueOnce({ completed: null });
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(mockSetIsProtected);
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(mockSetRedoSnapshots);

    const { result } = renderHook(useSelectedDeleting);
    const { handleDelete } = result.current;
    act(() => handleDelete());

    expect(mockSetIsProtected).not.toHaveBeenCalled();
    expect(mockSetNotes).not.toHaveBeenCalled();
    expect(mockSetUndoSnapshots).not.toHaveBeenCalled();
    expect(mockSetRedoSnapshots).not.toHaveBeenCalled();
  });

  it("Delete notes only with selected area", () => {
    (useRecoilState as jest.Mock).mockReturnValueOnce([
      Array(5).fill([...Array(4)].map((_, i) => ({ rowIdx: i, type: "X" }))),
      mockSetNotes,
    ]);
    (useRecoilState as jest.Mock).mockReturnValueOnce([
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
    (useRecoilValue as jest.Mock).mockReturnValueOnce({
      completed: {
        goalColumn: 3,
        goalRowIdx: 2,
        startColumn: 1,
        startRowIdx: 1,
      },
    });
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(mockSetIsProtected);
    (useSetRecoilState as jest.Mock).mockReturnValueOnce(mockSetRedoSnapshots);

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
