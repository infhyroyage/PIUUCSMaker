import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isProtectedState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
} from "../services/atoms";
import { Note } from "../types/ucs";
import { ChartSnapshot } from "../types/ucs";
import { Selector, SelectorCompletedCords } from "../types/chart";

function useSelectedDeleting() {
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const selector = useRecoilValue<Selector>(selectorState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
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

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        handleDelete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDelete]);

  return { handleDelete };
}

export default useSelectedDeleting;
