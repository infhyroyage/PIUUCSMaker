import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useUploadingUCS from "../../src/hooks/useUploadingUCS";
import { useStore } from "../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetUcsName = vi.fn();
const mockSetUserErrorMessage = vi.fn();
const mockSetIsProtected = vi.fn();
const mockSetIsPerformance = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockResetUndoSnapshots = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

const validUcs =
  ":Format=1\r\n:Mode=Single\r\n:BPM=120\r\n:Delay=0\r\n:Beat=4\r\n:Split=2\r\nX....\r\n";

describe("useUploadingUCS", () => {
  beforeEach(() => vi.resetAllMocks());

  it("does nothing when no file is selected", () => {
    // Given: empty file list
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });

    // When: upload handler runs without files
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: null, value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: store is not updated
    expect(mockSetBlocks).not.toHaveBeenCalled();
  });

  it("rejects non-ucs extension", () => {
    // Given: txt file selected
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });
    const file = new File(["content"], "chart.txt", { type: "text/plain" });
    // When: upload handler runs
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: [file], value: "chart.txt" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: user error is set
    expect(mockSetUserErrorMessage).toHaveBeenCalledWith("Extension is not ucs");
  });

  it("loads valid ucs content into store", async () => {
    // Given: valid ucs file
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });
    const file = new File([validUcs], "chart.ucs", { type: "text/plain" });

    // When: upload handler runs
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: [file], value: "chart.ucs" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: chart state is applied
    await waitFor(() => expect(mockSetBlocks).toHaveBeenCalled());
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetUcsName).toHaveBeenCalledWith("chart.ucs");
    expect(mockSetIsProtected).toHaveBeenCalledWith(false);
  });

  it("reports validation error for invalid mode line", async () => {
    // Given: invalid mode header
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });
    const content =
      ":Format=1\r\n:Mode=Invalid\r\n:BPM=120\r\n:Delay=0\r\n:Beat=4\r\n:Split=2\r\n.....\r\n";
    const file = new File([content], "bad.ucs", { type: "text/plain" });

    // When: upload handler runs
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: [file], value: "bad.ucs" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: mode validation error is surfaced
    await waitFor(() =>
      expect(mockSetUserErrorMessage).toHaveBeenCalledWith(
        "Line 2 of the ucs file is invalid"
      )
    );
  });

  it("reports validation error for invalid format line", async () => {
    // Given: invalid first line
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });
    const file = new File([":Format=2\r\n"], "bad.ucs", { type: "text/plain" });

    // When: upload handler runs
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: [file], value: "bad.ucs" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: line validation error is surfaced
    await waitFor(() =>
      expect(mockSetUserErrorMessage).toHaveBeenCalledWith(
        "Line 1 of the ucs file is invalid"
      )
    );
  });

  it("reports validation error for invalid ucs", async () => {
    // Given: invalid line endings
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: mockSetIsProtected,
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: mockResetUndoSnapshots,
      setUserErrorMessage: mockSetUserErrorMessage,
    });
    const file = new File([":Format=1\n"], "bad.ucs", { type: "text/plain" });

    // When: upload handler runs
    const { result } = renderHook(useUploadingUCS);
    act(() =>
      result.current.onUploadUCS({
        target: { files: [file], value: "bad.ucs" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: validation error is surfaced
    await waitFor(() =>
      expect(mockSetUserErrorMessage).toHaveBeenCalledWith(
        "Line break code is not CRLF"
      )
    );
  });
});
