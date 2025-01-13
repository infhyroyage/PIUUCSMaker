import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { undoSnapshotsState } from "../services/atoms";
import { ChartSnapshot } from "../types/ucs";
import useEditBlockDialog from "./useEditBlockDialog";
import useNewUcsDialog from "./useNewUcsDialog";
import { useStore } from "./useStore";

function useChartSnapshot() {
  const {
    resetBlockControllerMenuPosition,
    blocks,
    setBlocks,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setIsProtected,
    notes,
    setNotes,
    redoSnapshots,
    pushRedoSnapshot,
    popRedoSnapshot,
    hideSelector,
  } = useStore();
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);

  const { isOpenedNewUCSDialog } = useNewUcsDialog();
  const { isOpenedEditBlockDialog } = useEditBlockDialog();

  const handleRedo = useCallback(() => {
    // やり直すスナップショットが存在しない/ダイアログが開いている場合はNOP
    if (
      redoSnapshots.length === 0 ||
      isOpenedNewUCSDialog ||
      isOpenedEditBlockDialog
    )
      return;

    setIsProtected(true);

    // 元に戻す/やり直すスナップショットの集合を更新
    const snapshot: ChartSnapshot = popRedoSnapshot();
    setUndoSnapshots((prev: ChartSnapshot[]) => [
      ...prev,
      { blocks: snapshot.blocks && blocks, notes: snapshot.notes && notes },
    ]);

    // インディケーター・選択領域・メニューをすべて非表示
    resetIndicator();
    hideSelector();
    resetBlockControllerMenuPosition();
    resetChartIndicatorMenuPosition();

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点をやり直す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    blocks,
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    notes,
    redoSnapshots,
    resetBlockControllerMenuPosition,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setBlocks,
    setIsProtected,
    setNotes,
    hideSelector,
    popRedoSnapshot,
    setUndoSnapshots,
  ]);

  const handleUndo = useCallback(() => {
    // 元に直すスナップショットが存在しない/ダイアログが開いている場合はNOP
    if (
      undoSnapshots.length === 0 ||
      isOpenedNewUCSDialog ||
      isOpenedEditBlockDialog
    )
      return;

    // 元に戻すSnapshotを抽出
    const snapshot: ChartSnapshot = undoSnapshots[undoSnapshots.length - 1];

    // これ以上元に戻せられなくなる場合のみ編集中の離脱を抑止しない
    setIsProtected(undoSnapshots.length !== 1);

    // やり直すスナップショットの集合、元に戻すスナップショットの集合を更新
    pushRedoSnapshot({
      blocks: snapshot.blocks && blocks,
      notes: snapshot.notes && notes,
    });
    setUndoSnapshots((prev: ChartSnapshot[]) => prev.slice(0, prev.length - 1));

    // インディケーター・選択領域・メニューをすべて非表示
    resetIndicator();
    hideSelector();
    resetBlockControllerMenuPosition();
    resetChartIndicatorMenuPosition();

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を元に戻す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    blocks,
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    notes,
    undoSnapshots,
    resetBlockControllerMenuPosition,
    resetChartIndicatorMenuPosition,
    resetIndicator,
    setBlocks,
    setIsProtected,
    setNotes,
    hideSelector,
    pushRedoSnapshot,
    setUndoSnapshots,
  ]);

  return { handleRedo, handleUndo };
}

export default useChartSnapshot;
