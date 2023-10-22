import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note } from "../types/ucs";
import {
  blockControllerMenuPositionState,
  blocksState,
  chartIndicatorMenuPositionState,
  indicatorState,
  isOpenedEditBlockDialogState,
  isOpenedNewUCSDialogState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
} from "../service/atoms";
import { Indicator, Selector } from "../types/chart";
import {
  BlockControllerMenuPosition,
  ChartIndicatorMenuPosition,
} from "../types/menu";
import { ChartSnapshot } from "../types/ucs";

function useChartSnapshot() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [redoSnapshots, setRedoSnapshots] =
    useRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const isOpenedEditBlockDialog = useRecoilValue<boolean>(
    isOpenedEditBlockDialogState
  );
  const isOpenedNewUCSDialog = useRecoilValue<boolean>(
    isOpenedNewUCSDialogState
  );
  const setBlockControllerMenuPosition =
    useSetRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const setChartIndicatorMenuPosition =
    useSetRecoilState<ChartIndicatorMenuPosition>(
      chartIndicatorMenuPositionState
    );
  const setIndicator = useSetRecoilState<Indicator>(indicatorState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

  const handleRedo = useCallback(() => {
    // やり直すスナップショットが存在しない/ダイアログが開いている場合はNOP
    if (
      redoSnapshots.length === 0 ||
      isOpenedNewUCSDialog ||
      isOpenedEditBlockDialog
    )
      return;

    // やり直すスナップショットを抽出
    const snapshot: ChartSnapshot = redoSnapshots[redoSnapshots.length - 1];

    setIsProtected(true);

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([
      ...undoSnapshots,
      { blocks: snapshot.blocks && blocks, notes: snapshot.notes && notes },
    ]);
    setRedoSnapshots(redoSnapshots.slice(0, redoSnapshots.length - 1));

    // インディケーター・選択領域・メニューをすべて非表示
    setIndicator(null);
    setSelector({ setting: null, completed: null });
    setBlockControllerMenuPosition(undefined);
    setChartIndicatorMenuPosition(undefined);

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点をやり直す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    redoSnapshots,
    undoSnapshots,
    setBlockControllerMenuPosition,
    setBlocks,
    setChartIndicatorMenuPosition,
    setIndicator,
    setIsProtected,
    setNotes,
    setSelector,
    setRedoSnapshots,
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
    setRedoSnapshots([
      ...redoSnapshots,
      { blocks: snapshot.blocks && blocks, notes: snapshot.notes && notes },
    ]);
    setUndoSnapshots(undoSnapshots.slice(0, undoSnapshots.length - 1));

    // インディケーター・選択領域・メニューをすべて非表示
    setIndicator(null);
    setSelector({ setting: null, completed: null });
    setBlockControllerMenuPosition(undefined);
    setChartIndicatorMenuPosition(undefined);

    // 譜面のブロック、および、単ノート/ホールドの始点/ホールドの中間/ホールドの終点を元に戻す
    if (snapshot.blocks !== null) setBlocks(snapshot.blocks);
    if (snapshot.notes !== null) setNotes(snapshot.notes);
  }, [
    isOpenedEditBlockDialog,
    isOpenedNewUCSDialog,
    redoSnapshots,
    undoSnapshots,
    setBlockControllerMenuPosition,
    setBlocks,
    setChartIndicatorMenuPosition,
    setIndicator,
    setIsProtected,
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
