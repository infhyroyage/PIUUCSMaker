import { useCallback, useEffect } from "react";
import {
  ClipBoard,
  CopiedNote,
  Indicator,
  Note,
  Selector,
} from "../types/chart";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  clipBoardState,
  indicatorState,
  notesState,
  selectorState,
} from "../service/atoms";

function useClipBoard() {
  const [clipBoard, setClipBoard] = useRecoilState<ClipBoard>(clipBoardState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const selector = useRecoilValue<Selector>(selectorState);

  const updateClipBoard = (
    startColumn: number,
    goalColumn: number,
    startRowIdx: number,
    goalRowIdx: number
  ) => {
    setClipBoard({
      columnLength: goalColumn + 1 - startColumn,
      copiedNotes: [...Array(goalColumn - startColumn + 1)]
        .map((_, deltaColumn: number) =>
          notes[startColumn + deltaColumn]
            .filter(
              (note: Note) => note.idx >= startRowIdx && note.idx <= goalRowIdx
            )
            .map((note: Note) => {
              return {
                deltaColumn,
                deltaRowIdx: note.idx - startRowIdx,
                type: note.type,
              };
            })
        )
        .flat(),
      rowLength: goalRowIdx + 1 - startRowIdx,
    });
  };

  const handleCut = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return;

    // 選択領域の始点/終点の列インデックス/譜面全体での行インデックスをそれぞれ取得
    const startColumn: number = Math.min(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const goalColumn: number = Math.max(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const startRowIdx: number = Math.min(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );
    const goalRowIdx: number = Math.max(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );

    updateClipBoard(startColumn, goalColumn, startRowIdx, goalRowIdx);

    // 選択領域に含まれる領域のみ、単ノート/ホールドの始点/ホールドの中間/ホールドの終点のカット対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < startColumn || column > goalColumn
          ? ns
          : [
              ...ns.filter(
                (note: Note) => note.idx < startRowIdx || note.idx > goalRowIdx
              ),
            ]
      )
    );
  }, [notes, selector.completedCords, setClipBoard]);

  const handleCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return;

    // 選択領域の始点/終点の列インデックス/譜面全体での行インデックスをそれぞれ取得
    const startColumn: number = Math.min(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const goalColumn: number = Math.max(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const startRowIdx: number = Math.min(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );
    const goalRowIdx: number = Math.max(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );

    updateClipBoard(startColumn, goalColumn, startRowIdx, goalRowIdx);
  }, [notes, selector.completedCords, setClipBoard]);

  const handlePaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // インディケーターの位置を左上としたコピー時の選択領域に含まれる領域のみ、
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点のペースト対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < indicator.column ||
        column > indicator.column + clipBoard.columnLength - 1
          ? ns
          : [
              ...ns.filter((note: Note) => note.idx < indicator.rowIdx),
              ...clipBoard.copiedNotes
                .filter(
                  (copiedNote: CopiedNote) =>
                    copiedNote.deltaColumn === column - indicator.column
                )
                .map((copiedNote: CopiedNote) => {
                  return {
                    idx: indicator.rowIdx + copiedNote.deltaRowIdx,
                    type: copiedNote.type,
                  };
                }),
              ...ns.filter(
                (note: Note) =>
                  note.idx > indicator.rowIdx + clipBoard.rowLength - 1
              ),
            ]
      )
    );
  }, [clipBoard, indicator, notes, setNotes]);

  // キー入力のイベントリスナーを登録
  // アンマウント時に上記イベントリスナーを解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case "c":
            handleCopy();
            break;
          case "v":
            handlePaste();
            break;
          case "x":
            handleCut();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleCut, handlePaste]);

  return { handleCut, handleCopy, handlePaste };
}

export default useClipBoard;
