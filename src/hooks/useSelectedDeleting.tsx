import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { redoSnapshotsState, undoSnapshotsState } from "../services/atoms";
import { SelectorCompletedCords } from "../types/chart";
import { ChartSnapshot, Note } from "../types/ucs";
import { useStore } from "./useStore";

function useSelectedDeleting() {
  const { notes, setNotes, setIsProtected, selector } = useStore();
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  /**
   * 選択領域入力済に該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて削除する
   * @returns
   */
  const handleDelete = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (selector.completed === null) return;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
    setRedoSnapshots([]);

    setIsProtected(true);

    const completedCords: SelectorCompletedCords = selector.completed;
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < completedCords.startColumn ||
        column > completedCords.goalColumn
          ? // 選択領域外の列インデックスの場合はそのまま
            ns
          : [
              // 選択領域外の譜面全体での行インデックスのみ抽出
              ...ns.filter(
                (note: Note) => note.rowIdx < completedCords.startRowIdx
              ),
              ...ns.filter(
                (note: Note) => note.rowIdx > completedCords.goalRowIdx
              ),
            ]
      )
    );
  }, [
    notes,
    selector.completed,
    setIsProtected,
    setNotes,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  return { handleDelete };
}

export default useSelectedDeleting;
