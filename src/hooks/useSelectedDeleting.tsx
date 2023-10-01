import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { notesState } from "../service/atoms";
import { Note } from "../types/chart";
import useSelectedCords from "./useSelectedCords";

function useSelectedDeleting() {
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);

  const { getSelectedCords } = useSelectedCords();

  /**
   * 選択領域入力済に該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて削除する
   * @returns
   */
  const handleDelete = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    const selectedCords = getSelectedCords();
    if (selectedCords === null) return;

    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < selectedCords.startColumn || column > selectedCords.goalColumn
          ? // 選択領域外の列インデックスの場合はそのまま
            ns
          : [
              // 選択領域外の譜面全体での行インデックスのみ抽出
              ...ns.filter(
                (note: Note) => note.idx < selectedCords.startRowIdx
              ),
              ...ns.filter((note: Note) => note.idx > selectedCords.goalRowIdx),
            ]
      )
    );
  }, [getSelectedCords, notes, setNotes]);

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
