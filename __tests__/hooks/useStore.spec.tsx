import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "../../src/hooks/useStore";

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      blocks: [],
      notes: [],
      ucsName: null,
      undoSnapshots: [],
      redoSnapshots: [],
      selector: { completed: null, isSettingByMenu: false, setting: null },
      isProtected: false,
      noteSize: 0,
      zoom: { idx: 0, top: null },
    });
  });

  it("updates note size from window dimensions", () => {
    // Given: window dimensions
    Object.defineProperty(window, "innerWidth", { value: 300, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 450, configurable: true });

    // When: resize helper runs
    const { result } = renderHook(() => useStore());
    act(() => result.current.resizeNoteSizeWithWindow());

    // Then: noteSize uses min dimension / 15 with floor 20
    expect(result.current.noteSize).toBe(20);
  });

  it("pushes and pops undo snapshots", () => {
    // Given: empty undo stack
    const snapshot = { blocks: null, notes: [[{ rowIdx: 0, type: "X" }]] };

    // When: snapshot is pushed then popped
    const { result } = renderHook(() => useStore());
    act(() => result.current.pushUndoSnapshot(snapshot));
    let popped;
    act(() => {
      popped = result.current.popUndoSnapshot();
    });

    // Then: LIFO snapshot is returned and stack is empty
    expect(popped).toEqual(snapshot);
    expect(result.current.undoSnapshots).toHaveLength(0);
  });

  it("manages redo snapshots and chart metadata", () => {
    // Given: store with chart data
    const { result } = renderHook(() => useStore());
    const redoSnapshot = { blocks: null, notes: [[{ rowIdx: 0, type: "X" }]] };

    // When: redo and metadata helpers run
    act(() => {
      result.current.pushRedoSnapshot(redoSnapshot);
      result.current.setUcsName("demo.ucs");
      result.current.setSuccessMessage("ok");
      result.current.setUserErrorMessage("err");
      result.current.setVolumeValue(0.25);
      result.current.toggleIsMuteBeats();
    });
    let popped;
    act(() => {
      popped = result.current.popRedoSnapshot();
      result.current.resetRedoSnapshots();
    });

    // Then: values are updated
    expect(popped).toEqual(redoSnapshot);
    expect(result.current.ucsName).toBe("demo.ucs");
    expect(result.current.successMessage).toBe("ok");
    expect(result.current.userErrorMessage).toBe("err");
    expect(result.current.volumeValue).toBe(0.25);
    expect(result.current.isMuteBeats).toBe(false);
    expect(result.current.redoSnapshots).toHaveLength(0);
  });

  it("updates zoom index and preserves scroll ratio", () => {
    // Given: scroll position and zoom index
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 100,
      configurable: true,
    });
    const { result } = renderHook(() => useStore());

    // When: zoom index changes
    act(() => result.current.updateZoomFromIdx(2));

    // Then: zoom state updates with computed top
    expect(result.current.zoom.idx).toBe(2);
    expect(result.current.zoom.top).not.toBeNull();
  });

  it("updates indicator, hold setter, and clipboard state", () => {
    // Given: store defaults
    const { result } = renderHook(() => useStore());

    // When: UI helpers are toggled
    act(() => {
      result.current.setIndicator({
        blockAccumulatedRows: 0,
        blockIdx: 0,
        column: 0,
        rowIdx: 1,
        top: 5,
      });
      result.current.setHoldSetter({
        column: 0,
        rowIdx: 0,
        top: 0,
        isSettingByMenu: false,
      });
      result.current.setClipBoard({
        columnLength: 1,
        rowLength: 1,
        copiedNotes: [],
      });
      result.current.setIsPerformance(true);
      result.current.setIsPlaying(true);
      result.current.setIsProtected(true);
      result.current.setMp3Name("a.mp3");
      result.current.setBlocks([
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 2, split: 2 },
      ]);
      result.current.setNotes([[{ rowIdx: 0, type: "X" }]]);
    });

    // Then: state reflects updates
    expect(result.current.indicator?.rowIdx).toBe(1);
    expect(result.current.holdSetter?.column).toBe(0);
    expect(result.current.clipBoard).not.toBeNull();
    expect(result.current.isPerformance).toBe(true);
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isProtected).toBe(true);
    expect(result.current.mp3Name).toBe("a.mp3");
    act(() => {
      result.current.resetIndicator();
      result.current.resetHoldSetter();
      result.current.resetClipBoard();
      result.current.resetUndoSnapshots();
    });
    expect(result.current.indicator).toBeNull();
    expect(result.current.holdSetter).toBeNull();
    expect(result.current.clipBoard).toBeNull();
  });

  it("manages dialog forms and menu positions", () => {
    // Given: store defaults
    const { result } = renderHook(() => useStore());

    // When: dialog and menu helpers run
    act(() => {
      result.current.setAdjustBlockDialogForm({ bpm: 100, rows: 8, split: 4 });
      result.current.setBlockControllerMenuBlockIdx(0);
      result.current.setBlockControllerMenuPosition({ top: 12, left: 34 });
      result.current.setEditBlockDialogForm({
        beat: "8",
        bpm: "200",
        delay: "10",
        rows: "16",
        split: "4",
      });
      result.current.setChartIndicatorMenuPosition({ top: 1, left: 2 });
    });

    // Then: values are stored
    expect(result.current.adjustBlockDialogForm.bpm).toBe(100);
    expect(result.current.blockControllerMenuBlockIdx).toBe(0);
    expect(result.current.editBlockDialogForm.bpm).toBe("200");
    expect(result.current.chartIndicatorMenuPosition).toEqual({
      top: 1,
      left: 2,
    });

    // When: reset helpers run
    act(() => {
      result.current.resetAdjustBlockDialogForm();
      result.current.resetBlockControllerMenuBlockIdx();
      result.current.resetBlockControllerMenuPosition();
      result.current.resetEditBlockDialogForm();
      result.current.resetChartIndicatorMenuPosition();
    });

    // Then: values return to defaults
    expect(result.current.blockControllerMenuBlockIdx).toBeNull();
    expect(result.current.chartIndicatorMenuPosition).toBeUndefined();
  });

  it("hides selector and toggles dark mode", () => {
    // Given: selector with completed area
    const { result } = renderHook(() => useStore());
    act(() =>
      result.current.setSelector({
        completed: {
          startColumn: 0,
          goalColumn: 0,
          startRowIdx: 0,
          goalRowIdx: 0,
        },
        isSettingByMenu: true,
        setting: null,
      })
    );

    // When: hide and theme toggle run
    act(() => result.current.hideSelector());
    const initialDark = result.current.isDarkMode;
    act(() => result.current.toggleIsDarkMode());

    // Then: selector resets and theme flips
    expect(result.current.selector.completed).toBeNull();
    expect(result.current.isDarkMode).toBe(!initialDark);
  });
});
