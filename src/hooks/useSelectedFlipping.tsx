import { useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isProtectedState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../service/atoms";
import { Note } from "../types/chart";
import useSelectedCords from "./useSelectedCords";
import { ChartSnapshot } from "../types/ui";

function useSelectedFlipping() {
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const { getSelectedCords } = useSelectedCords();

  /**
   * 選択領域入力済に該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を、すべて左右反転/上下反転する
   * @param isHorizontal 左右反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @param isVertical 上下反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @returns
   */
  const handleFlip = useCallback(
    (isHorizontal: boolean, isVertical: boolean) => {
      // 選択領域が非表示/入力中の場合はNOP
      const selectedCords = getSelectedCords();
      if (selectedCords === null) return;

      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
      setRedoShapshots([]);

      setIsProtected(true);

      setNotes(
        notes.map((ns: Note[], column: number) =>
          column < selectedCords.startColumn ||
          column > selectedCords.goalColumn
            ? // 選択領域外の列インデックスの場合はそのまま
              ns
            : [
                // 選択領域外の譜面全体での行インデックスの場合はそのまま
                ...ns.filter(
                  (note: Note) => note.rowIdx < selectedCords.startRowIdx
                ),
                ...(isHorizontal
                  ? // 左右反転
                    notes[
                      selectedCords.startColumn +
                        selectedCords.goalColumn -
                        column
                    ]
                  : ns
                )
                  // 選択領域内の譜面全体での行インデックスのみ抽出
                  .filter(
                    (note: Note) =>
                      note.rowIdx >= selectedCords.startRowIdx &&
                      note.rowIdx <= selectedCords.goalRowIdx
                  )
                  .map<Note>((note: Note) =>
                    isVertical
                      ? // 上下反転
                        {
                          rowIdx:
                            selectedCords.startRowIdx +
                            selectedCords.goalRowIdx -
                            note.rowIdx,
                          type:
                            note.type === "M"
                              ? "W"
                              : note.type === "W"
                              ? "M"
                              : note.type,
                        }
                      : note
                  )
                  .reverse(),
                // 選択領域外の譜面全体での行インデックスの場合はそのまま
                ...ns.filter(
                  (note: Note) => note.rowIdx > selectedCords.goalRowIdx
                ),
              ]
        )
      );
    },
    [
      getSelectedCords,
      notes,
      setIsProtected,
      setNotes,
      setRedoShapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "m":
          handleFlip(true, true);
          break;
        case "x":
          handleFlip(true, false);
          break;
        case "y":
          handleFlip(false, true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlip]);

  return { handleFlip };
}

export default useSelectedFlipping;
