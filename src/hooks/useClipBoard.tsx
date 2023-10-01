import { useCallback, useEffect } from "react";
import {
  ClipBoard,
  CopiedNote,
  Indicator,
  Note,
  SelectedCords,
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

  const updateClipBoard = useCallback(
    (selectedCords: SelectedCords) => {
      setClipBoard({
        columnLength: selectedCords.goalColumn + 1 - selectedCords.startColumn,
        copiedNotes: [
          ...Array(selectedCords.goalColumn - selectedCords.startColumn + 1),
        ]
          .map((_, deltaColumn: number) =>
            notes[selectedCords.startColumn + deltaColumn]
              .filter(
                (note: Note) =>
                  note.idx >= selectedCords.startRowIdx &&
                  note.idx <= selectedCords.goalRowIdx
              )
              .map((note: Note) => {
                return {
                  deltaColumn,
                  deltaRowIdx: note.idx - selectedCords.startRowIdx,
                  type: note.type,
                };
              })
          )
          .flat(),
        rowLength: selectedCords.goalRowIdx + 1 - selectedCords.startRowIdx,
      });
    },
    [notes, setClipBoard]
  );

  const handleCut = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    const selectedCords: null | SelectedCords = getSelectedCords();
    if (selectedCords === null) return;

    updateClipBoard(selectedCords);

    // 選択領域に含まれる領域のみ、単ノート/ホールドの始点/ホールドの中間/ホールドの終点のカット対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < selectedCords.startColumn || column > selectedCords.goalColumn
          ? ns
          : [
              ...ns.filter(
                (note: Note) =>
                  note.idx < selectedCords.startRowIdx ||
                  note.idx > selectedCords.goalRowIdx
              ),
            ]
      )
    );
  }, [getSelectedCords, notes, setNotes, updateClipBoard]);

  const handleCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    const selectedCords: null | SelectedCords = getSelectedCords();
    if (selectedCords === null) return;

    updateClipBoard(selectedCords);
  }, [updateClipBoard, getSelectedCords]);

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
