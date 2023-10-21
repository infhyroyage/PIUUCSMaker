import { useCallback, useEffect, useMemo } from "react";
import { Block, Note } from "../types/ucs";
import { SelectedCords, Selector } from "../types/ui";
import { ChartSnapshot } from "../types/ucs";
import { Indicator } from "../types/ui";
import { ClipBoard } from "../types/ucs";
import { CopiedNote } from "../types/ucs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  clipBoardState,
  columnsState,
  indicatorState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
} from "../service/atoms";
import useSelectedCords from "./useSelectedCords";

function useClipBoard() {
  const [clipBoard, setClipBoard] = useRecoilState<ClipBoard>(clipBoardState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const blocks = useRecoilValue<Block[]>(blocksState);
  const columns = useRecoilValue<5 | 10>(columnsState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const setSelector = useSetRecoilState<Selector>(selectorState);

  const { getSelectedCords } = useSelectedCords();

  // 全譜面のブロックの行数の総和を計算
  const totalRows = useMemo(
    () =>
      blocks[blocks.length - 1].accumulatedRows +
      blocks[blocks.length - 1].rows,
    [blocks]
  );

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
                  note.rowIdx >= selectedCords.startRowIdx &&
                  note.rowIdx <= selectedCords.goalRowIdx
              )
              .map((note: Note) => {
                return {
                  deltaColumn,
                  deltaRowIdx: note.rowIdx - selectedCords.startRowIdx,
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

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
    setRedoShapshots([]);

    setIsProtected(true);

    // 選択領域に含まれる領域のみ、単ノート/ホールドの始点/ホールドの中間/ホールドの終点のカット対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < selectedCords.startColumn || column > selectedCords.goalColumn
          ? ns
          : [
              ...ns.filter(
                (note: Note) =>
                  note.rowIdx < selectedCords.startRowIdx ||
                  note.rowIdx > selectedCords.goalRowIdx
              ),
            ]
      )
    );
  }, [
    getSelectedCords,
    notes,
    setIsProtected,
    setNotes,
    setRedoShapshots,
    setUndoSnapshots,
    updateClipBoard,
    undoSnapshots,
  ]);

  const handleCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    const selectedCords: null | SelectedCords = getSelectedCords();
    if (selectedCords === null) return;

    updateClipBoard(selectedCords);
  }, [updateClipBoard, getSelectedCords]);

  const handlePaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
    setRedoShapshots([]);

    setIsProtected(true);

    // インディケーターの位置を左上としたコピー時の選択領域に含まれる領域と、
    // 各譜面のブロックで構成した譜面の領域との共通領域のみ、
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点のペースト対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < indicator.column ||
        column > indicator.column + clipBoard.columnLength - 1
          ? ns
          : [
              ...ns.filter((note: Note) => note.rowIdx < indicator.rowIdx),
              ...clipBoard.copiedNotes
                .filter(
                  (copiedNote: CopiedNote) =>
                    copiedNote.deltaColumn === column - indicator.column &&
                    indicator.rowIdx + copiedNote.deltaRowIdx < totalRows
                )
                .map((copiedNote: CopiedNote) => {
                  return {
                    rowIdx: indicator.rowIdx + copiedNote.deltaRowIdx,
                    type: copiedNote.type,
                  };
                }),
              ...ns.filter(
                (note: Note) =>
                  note.rowIdx > indicator.rowIdx + clipBoard.rowLength - 1
              ),
            ]
      )
    );

    // ペースト対象の領域を選択領域として設定
    setSelector({
      setting: null,
      completed: {
        mouseDownColumn: indicator.column,
        mouseDownRowIdx: indicator.rowIdx,
        mouseUpColumn:
          Math.min(indicator.column + clipBoard.columnLength, columns) - 1,
        mouseUpRowIdx:
          Math.min(indicator.rowIdx + clipBoard.rowLength, totalRows) - 1,
      },
    });
  }, [
    clipBoard,
    columns,
    indicator,
    notes,
    setIsProtected,
    setNotes,
    setRedoShapshots,
    setSelector,
    setUndoSnapshots,
    totalRows,
    undoSnapshots,
  ]);

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
