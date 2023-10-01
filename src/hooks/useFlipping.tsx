import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { notesState, selectorState } from "../service/atoms";
import { Note, SelectedCords, Selector } from "../types/chart";

function useFlipping() {
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const selector = useRecoilValue<Selector>(selectorState);

  const getSelectedCords: () => null | SelectedCords = useCallback(() => {
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return null;

    return {
      startColumn: Math.min(
        selector.completedCords.mouseDownColumn,
        selector.completedCords.mouseUpColumn
      ),
      goalColumn: Math.max(
        selector.completedCords.mouseDownColumn,
        selector.completedCords.mouseUpColumn
      ),
      startRowIdx: Math.min(
        selector.completedCords.mouseDownRowIdx,
        selector.completedCords.mouseUpRowIdx
      ),
      goalRowIdx: Math.max(
        selector.completedCords.mouseDownRowIdx,
        selector.completedCords.mouseUpRowIdx
      ),
    };
  }, [selector.completedCords]);

  /**
   * 選択領域入力済に該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を
   * すべて左右反転/上下反転する
   * @param isHorizontal 左右反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @param isVertical 上下反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @returns
   */
  const flip: (isHorizontal: boolean, isVertical: boolean) => void =
    useCallback(
      (isHorizontal: boolean, isVertical: boolean) => {
        // 選択領域が非表示/入力中の場合はNOP
        const selectedCords = getSelectedCords();
        if (selectedCords === null) return;

        setNotes(
          notes.map((ns: Note[], column: number) =>
            column < selectedCords.startColumn ||
            column > selectedCords.goalColumn
              ? // 選択領域外の列インデックスの場合はそのまま
                ns
              : [
                  // 選択領域外の譜面全体での行インデックスの場合はそのまま
                  ...ns.filter(
                    (note: Note) => note.idx < selectedCords.startRowIdx
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
                        note.idx >= selectedCords.startRowIdx &&
                        note.idx <= selectedCords.goalRowIdx
                    )
                    .map<Note>((note: Note) =>
                      isVertical
                        ? // 上下反転
                          {
                            idx:
                              selectedCords.startRowIdx +
                              selectedCords.goalRowIdx -
                              note.idx,
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
                    (note: Note) => note.idx > selectedCords.goalRowIdx
                  ),
                ]
          )
        );
      },
      [getSelectedCords, notes, setNotes]
    );

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "m":
          flip(true, true);
          break;
        case "x":
          flip(true, false);
          break;
        case "y":
          flip(false, true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flip]);

  return { flip };
}

export default useFlipping;
