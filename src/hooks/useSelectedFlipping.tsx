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

function useSelectedFlipping() {
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const selector = useRecoilValue<Selector>(selectorState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  /**
   * 選択領域入力済に該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点を、すべて左右反転/上下反転する
   * @param isHorizontal 左右反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @param isVertical 上下反転/Mirrorする場合はtrue、そうでない場合はfalse
   * @returns
   */
  const handleFlip = useCallback(
    (isHorizontal: boolean, isVertical: boolean) => {
      // 選択領域が非表示/入力中の場合はNOP
      if (selector.completed === null) return;

      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
      setRedoSnapshots([]);

      setIsProtected(true);

      // 選択領域内の各列インデックスに対し、上下反転・左右反転の反転元(from)と反転先(to)をすべて計算
      const completedCords: SelectorCompletedCords = selector.completed;
      const flippedParams: { from: number; to: number }[] = Array.from(
        { length: completedCords.goalColumn - completedCords.startColumn + 1 },
        (_, i) => completedCords.startColumn + i
      ).reduce((prev: { from: number; to: number }[], from: number) => {
        // 2重反転の抑止
        if (
          prev.find((param: { from: number; to: number }) => param.to === from)
        )
          return prev;

        // 列インデックスの上下反転・左右反転先を計算
        let to: number = from;
        if (isVertical) {
          to =
            to % 5 === 0 || to % 5 === 3
              ? to + 1
              : to % 5 === 1 || to % 5 === 4
              ? to - 1
              : to;
        }
        if (isHorizontal) {
          to = notes.length - to - 1;
        }
        return [...prev, { from, to }];
      }, []);

      // 選択領域内の譜面全体の行インデックスでの単ノート/ホールドの始点/ホールドの中間/ホールドの終点を対象に、
      // 上下反転・左右反転を実行
      const flippedNotes: Note[][] = [...Array(notes.length)].reduce(
        (prev: Note[][], _, column: number) => {
          const foundParam: { from: number; to: number } | undefined =
            flippedParams.find(
              (param: { from: number; to: number }) => param.from === column
            );
          if (foundParam) {
            [prev[foundParam.from], prev[foundParam.to]] = [
              prev[foundParam.to],
              prev[foundParam.from],
            ];
          }
          return prev;
        },
        notes.map((ns: Note[]) =>
          ns.filter(
            (note: Note) =>
              note.rowIdx >= completedCords.startRowIdx &&
              note.rowIdx <= completedCords.goalRowIdx
          )
        )
      );

      setNotes(
        notes.map((ns: Note[], column: number) => [
          ...ns.filter(
            (note: Note) => note.rowIdx < completedCords.startRowIdx
          ),
          ...flippedNotes[column],
          ...ns.filter((note: Note) => note.rowIdx > completedCords.goalRowIdx),
        ])
      );
    },
    [
      notes,
      selector.completed,
      setIsProtected,
      setNotes,
      setRedoSnapshots,
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
