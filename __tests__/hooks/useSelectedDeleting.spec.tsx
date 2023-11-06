import { act, renderHook } from "@testing-library/react";
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

  it("Do nothing if selector.completed is null", async () => {
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
    act(() => {
      handleDelete();

      // Trigger the Delete key event.
      // const event = new KeyboardEvent("keydown", { key: "Delete" });
      // document.dispatchEvent(event);
    });

    expect(mockSetIsProtected).not.toHaveBeenCalled();
    expect(mockSetNotes).not.toHaveBeenCalled();
    expect(mockSetUndoSnapshots).not.toHaveBeenCalled();
    expect(mockSetRedoSnapshots).not.toHaveBeenCalled();
  });
});
