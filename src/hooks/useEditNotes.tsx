import { useRecoilState, useSetRecoilState } from "recoil";
import { Chart, Note } from "../types/ucs";
import { chartState, isShownSystemErrorSnackbarState } from "../service/atoms";

function useEditNotes() {
  const [chart, setChart] = useRecoilState<Chart | null>(chartState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  // 譜面全体での行インデックスmouseDownRowIdxで押下した後に
  // 譜面全体での行インデックスmouseUpRowIdxで押下を離した際の
  // 列インデックスcolumnにて、単ノート/ホールドの追加・削除を行う
  const editNotes = (
    column: number,
    mouseDownRowIdx: number,
    mouseUpRowIdx: number
  ) => {
    // 内部矛盾チェック
    if (chart === null) {
      setIsShownSystemErrorSnackbar(true);
      return;
    }

    // mouseDownRowIdx/mouseUpRowIdxに対応する譜面のブロックのインデックスである
    // mouseDownBlockIdx/mouseUpBlockIdxをそれぞれ取得
    let mouseDownBlockIdx: number | null = null;
    let mouseUpBlockIdx: number | null = null;
    let accumulatedBlockLength: number = 0;
    for (let i = 0; i < chart.blocks.length; i++) {
      if (
        mouseDownBlockIdx === null &&
        mouseDownRowIdx < accumulatedBlockLength + chart.blocks[i].length
      ) {
        mouseDownBlockIdx = i;
      }
      if (
        mouseUpBlockIdx === null &&
        mouseUpRowIdx < accumulatedBlockLength + chart.blocks[i].length
      ) {
        mouseUpBlockIdx = i;
      }

      if (mouseDownBlockIdx !== null && mouseUpBlockIdx !== null) break;

      accumulatedBlockLength = accumulatedBlockLength + chart.blocks[i].length;
    }

    // 内部矛盾チェック
    if (mouseDownBlockIdx === null || mouseUpBlockIdx === null) {
      setIsShownSystemErrorSnackbar(true);
      return;
    }

    // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
    const start: number =
      mouseDownRowIdx < mouseUpRowIdx ? mouseDownRowIdx : mouseUpRowIdx;
    const goal: number =
      mouseDownRowIdx < mouseUpRowIdx ? mouseUpRowIdx : mouseDownRowIdx;

    let updatedNotes: Note[];
    if (start === goal) {
      // startの場所に単ノートを新規追加
      // ただし、その場所に単ノート/ホールドが含む場合は、それを削除する(単ノートは新規追加しない)
      const noteIdx: number = chart.notes[column].findIndex(
        (note: Note) => note.start <= start && start <= note.goal
      );
      updatedNotes =
        noteIdx === -1
          ? [...chart.notes[column], { start, goal }]
          : [
              ...chart.notes[column].slice(0, noteIdx),
              ...chart.notes[column].slice(noteIdx + 1),
            ];
    } else {
      // startとgoalとの間にホールドを新規追加
      // ただし、その間の場所に単ノート/ホールドが含む場合は、それをすべて削除してから新規追加する
      updatedNotes = chart.notes[column].filter(
        (note: Note) => note.start > goal || note.goal < start
      );
    }

    // 譜面の更新
    setChart({
      ...chart,
      notes: chart.notes.map((notes: Note[], i: number) =>
        i === column ? updatedNotes : notes
      ),
    });
  };

  return { editNotes };
}

export default useEditNotes;
