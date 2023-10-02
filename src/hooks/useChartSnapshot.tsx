import { useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Block, Note } from "../types/chart";
import {
  blocksState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../service/atoms";
import { ChartSnapshot } from "../types/ui";

function useChartSnapshot() {
  const setBlocks = useSetRecoilState<Block[]>(blocksState);
  const setNotes = useSetRecoilState<Note[][]>(notesState);
  const [redoSnapshots, setRedoSnapshots] =
    useRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);

  const handleRedo = useCallback(() => {
    // やり直すスナップショットが存在しない場合はNOP
    if (redoSnapshots.length === 0) return;

    // やり直すスナップショットを抽出
    const snapshot: ChartSnapshot = redoSnapshots[redoSnapshots.length - 1];

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点をやり直す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);

    // 元に戻すスナップショットの集合、やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, snapshot]);
    setRedoSnapshots(redoSnapshots.slice(0, redoSnapshots.length - 1));
  }, [
    redoSnapshots,
    undoSnapshots,
    setBlocks,
    setNotes,
    setRedoSnapshots,
    setUndoSnapshots,
  ]);

  const handleUndo = useCallback(() => {
    // 元に直すスナップショットが存在しない場合はNOP
    if (undoSnapshots.length === 0) return;

    // 元に戻すSnapshotを抽出
    const snapshot: ChartSnapshot = undoSnapshots[undoSnapshots.length - 1];

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を元に戻す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);

    // やり直すスナップショットの集合、元に戻すスナップショットの集合を更新
    setRedoSnapshots([...redoSnapshots, snapshot]);
    setUndoSnapshots(undoSnapshots.slice(0, undoSnapshots.length - 1));
  }, [
    redoSnapshots,
    undoSnapshots,
    setBlocks,
    setNotes,
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
