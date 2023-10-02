import { useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Block, Note } from "../types/chart";
import {
  blockControllerMenuPositionState,
  blocksState,
  chartIndicatorMenuPositionState,
  indicatorState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
} from "../service/atoms";
import {
  BlockControllerMenuPosition,
  ChartSnapshot,
  Indicator,
  Selector,
} from "../types/ui";
import { PopoverPosition } from "@mui/material";

function useChartSnapshot() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [redoSnapshots, setRedoSnapshots] =
    useRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setBlockControllerMenuPosition =
    useSetRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const setChartIndicatorMenuPosition = useSetRecoilState<
    PopoverPosition | undefined
  >(chartIndicatorMenuPositionState);
  const setIndicator = useSetRecoilState<Indicator>(indicatorState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

  const handleRedo = useCallback(() => {
    // やり直すスナップショットが存在しない場合はNOP
    if (redoSnapshots.length === 0) return;

    // やり直すスナップショットを抽出
    const snapshot: ChartSnapshot = redoSnapshots[redoSnapshots.length - 1];

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([
      ...undoSnapshots,
      { blocks: snapshot.blocks && blocks, notes: snapshot.notes && notes },
    ]);
    setRedoSnapshots(redoSnapshots.slice(0, redoSnapshots.length - 1));

    // インディケーター・選択領域・メニューをすべて非表示
    setIndicator(null);
    setSelector({ changingCords: null, completedCords: null });
    setBlockControllerMenuPosition(undefined);
    setChartIndicatorMenuPosition(undefined);

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点をやり直す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    redoSnapshots,
    undoSnapshots,
    setBlockControllerMenuPosition,
    setBlocks,
    setChartIndicatorMenuPosition,
    setIndicator,
    setNotes,
    setSelector,
    setRedoSnapshots,
    setUndoSnapshots,
  ]);

  const handleUndo = useCallback(() => {
    // 元に直すスナップショットが存在しない場合はNOP
    if (undoSnapshots.length === 0) return;

    // 元に戻すSnapshotを抽出
    const snapshot: ChartSnapshot = undoSnapshots[undoSnapshots.length - 1];

    // やり直すスナップショットの集合、元に戻すスナップショットの集合を更新
    setRedoSnapshots([
      ...redoSnapshots,
      { blocks: snapshot.blocks && blocks, notes: snapshot.notes && notes },
    ]);
    setUndoSnapshots(undoSnapshots.slice(0, undoSnapshots.length - 1));

    // インディケーター・選択領域・メニューをすべて非表示
    setIndicator(null);
    setSelector({ changingCords: null, completedCords: null });
    setBlockControllerMenuPosition(undefined);
    setChartIndicatorMenuPosition(undefined);

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を元に戻す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    redoSnapshots,
    undoSnapshots,
    setBlockControllerMenuPosition,
    setBlocks,
    setChartIndicatorMenuPosition,
    setIndicator,
    setNotes,
    setSelector,
    setRedoSnapshots,
    setUndoSnapshots,
  ]);

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "y":
            handleRedo();
            break;
          case "z":
            handleUndo();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRedo, handleUndo]);

  return { handleRedo, handleUndo };
}

export default useChartSnapshot;
