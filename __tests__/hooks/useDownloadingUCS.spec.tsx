import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useDownloadingUCS from "../../src/hooks/useDownloadingUCS";
import { useStore } from "../../src/hooks/useStore";

const mockSetIsProtected = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("useDownloadingUCS", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  it("builds double performance mode content", async () => {
    // Given: double performance chart
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 1, split: 2 },
      ],
      isPerformance: true,
      notes: Array(10).fill([{ rowIdx: 0, type: "X" }]),
      ucsName: "perf.ucs",
      setIsProtected: mockSetIsProtected,
    });
    const appendChild = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(() => document.createElement("a"));
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    // When: download runs
    const { result } = renderHook(useDownloadingUCS);
    act(() => result.current.downloadUCS());

    // Then: download is triggered
    await waitFor(() =>
      expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
    );
    appendChild.mockRestore();
  });

  it("does nothing when ucsName is null", () => {
    // Given: no UCS name
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [],
      isPerformance: false,
      notes: [],
      ucsName: null,
      setIsProtected: mockSetIsProtected,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    // When: download is triggered
    const { result } = renderHook(useDownloadingUCS);
    act(() => result.current.downloadUCS());

    // Then: no download anchor is clicked
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("downloads UCS and clears protection", async () => {
    // Given: chart ready to export
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 1, split: 2 },
      ],
      isPerformance: false,
      notes: [[{ rowIdx: 0, type: "X" }], [], [], [], []],
      ucsName: "test.ucs",
      setIsProtected: mockSetIsProtected,
    });
    const appendChild = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation(() => document.createElement("a"));
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    // When: download runs
    const { result } = renderHook(useDownloadingUCS);
    act(() => result.current.downloadUCS());

    // Then: anchor click and protection reset occur
    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    await waitFor(() => expect(mockSetIsProtected).toHaveBeenCalledWith(false));
    appendChild.mockRestore();
  });
});
