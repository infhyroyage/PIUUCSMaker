import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import usePlaying from "../../src/hooks/usePlaying";
import { useStore } from "../../src/hooks/useStore";

const mockSetIsPlaying = vi.fn();
const mockSetUserErrorMessage = vi.fn();
const mockSetSuccessMessage = vi.fn();
const mockSetMp3Name = vi.fn();

vi.mock("../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("usePlaying", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 2, split: 2 },
      ],
      isMuteBeats: true,
      isPlaying: false,
      setIsPlaying: mockSetIsPlaying,
      noteSize: 40,
      setMp3Name: mockSetMp3Name,
      notes: [[], [], [], [], []],
      setSuccessMessage: mockSetSuccessMessage,
      setUserErrorMessage: mockSetUserErrorMessage,
      volumeValue: 0.5,
      zoom: { idx: 0, top: null },
    });
    global.fetch = vi.fn().mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    }) as unknown as typeof fetch;
    class MockAudioContext {
      destination = {};
      createGain() {
        return { gain: { value: 0 }, connect: vi.fn() };
      }
      decodeAudioData() {
        return Promise.resolve({ duration: 1 });
      }
    }
    global.AudioContext =
      MockAudioContext as unknown as typeof AudioContext;
  });

  afterEach(() => {
    document.body.style.overflowY = "";
  });

  it("starts playback by setting isPlaying", () => {
    // Given: idle player hook
    const { result } = renderHook(usePlaying);

    // When: start is called
    act(() => result.current.start());

    // Then: playing flag is set
    expect(mockSetIsPlaying).toHaveBeenCalledWith(true);
  });

  it("stops playback by clearing isPlaying", () => {
    // Given: playing hook
    const { result } = renderHook(usePlaying);

    // When: stop is called
    act(() => result.current.stop());

    // Then: playing flag is cleared
    expect(mockSetIsPlaying).toHaveBeenCalledWith(false);
  });

  it("rejects non-mp3 uploads", () => {
    // Given: txt file
    const file = new File(["data"], "song.txt", { type: "audio/mpeg" });
    const { result } = renderHook(usePlaying);

    // When: mp3 upload handler runs
    act(() =>
      result.current.onUploadMP3({
        target: { files: [file], value: "song.txt" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: user error is reported
    expect(mockSetUserErrorMessage).toHaveBeenCalledWith("Extension is not mp3");
  });

  it("locks body scroll while playing", () => {
    // Given: playing state enabled in store
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 2, split: 2 },
      ],
      isMuteBeats: true,
      isPlaying: true,
      setIsPlaying: mockSetIsPlaying,
      noteSize: 40,
      setMp3Name: mockSetMp3Name,
      notes: [[], [], [], [], []],
      setSuccessMessage: mockSetSuccessMessage,
      setUserErrorMessage: mockSetUserErrorMessage,
      volumeValue: 0.5,
      zoom: { idx: 0, top: null },
    });

    // When: hook renders during playback
    renderHook(usePlaying);

    // Then: vertical scroll is hidden
    expect(document.body.style.overflowY).toBe("hidden");
  });

  it("uploads valid mp3 and sets success message", async () => {
    // Given: mp3 file and decode support
    const file = new File([new ArrayBuffer(8)], "song.mp3", {
      type: "audio/mpeg",
    });
    Object.defineProperty(file, "arrayBuffer", {
      value: () => Promise.resolve(new ArrayBuffer(8)),
    });
    const { result } = renderHook(usePlaying);

    // When: mp3 upload handler runs
    act(() =>
      result.current.onUploadMP3({
        target: { files: [file], value: "song.mp3" },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    );

    // Then: mp3 name and success message are stored
    await waitFor(() => expect(mockSetMp3Name).toHaveBeenCalledWith("song.mp3"));
    await waitFor(() =>
      expect(mockSetSuccessMessage).toHaveBeenCalledWith(
        "song.mp3 was successfully uploaded"
      )
    );
  });
});
