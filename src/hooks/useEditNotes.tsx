import { useRecoilState, useSetRecoilState } from "recoil";
import { Block, Chart, Note } from "../types/ucs";
import { chartState, isShownSystemErrorSnackbarState } from "../service/atoms";

function useEditNotes() {
  const [chart, setChart] = useRecoilState<Chart | null>(chartState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  // 譜面全体での行インデックスmouseDownRowIdxで押下した後に
  // 譜面全体での行インデックスmouseUpRowIdxで押下を離した際の
  // 列インデックスcolumnにて、単ノート/(中抜き)ホールドの追加・削除を行う
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
    for (let i = 0; chart.blocks.length; i++) {
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

    // 単ノート/ホールド/中抜きホールドの始点start、終点goalの譜面全体での行インデックスを取得
    const start: number =
      mouseDownRowIdx < mouseUpRowIdx ? mouseDownRowIdx : mouseUpRowIdx;
    const goal: number =
      mouseDownRowIdx < mouseUpRowIdx ? mouseUpRowIdx : mouseDownRowIdx;
    // startに対応する譜面のブロックのインデックスを取得
    const startBlockIdx: number =
      mouseDownBlockIdx < mouseUpBlockIdx ? mouseDownBlockIdx : mouseUpBlockIdx;

    let updatedChart: Chart;
    if (start === goal) {
      let updatedNotes: Note[] = [...chart.blocks[startBlockIdx].notes[column]];

      // startの場所に単ノートを新規追加
      // ただし、その場所に単ノート/(中抜き)ホールドが含む場合は、それを削除する(単ノートは新規追加しない)
      const noteIdx: number = chart.blocks[startBlockIdx].notes[
        column
      ].findIndex((note: Note) => note.start <= start && start <= note.goal);
      if (noteIdx === -1) {
        updatedNotes.push({
          start,
          goal,
          hollowStarts: [],
          hollowGoals: [],
        });
      } else {
        updatedNotes = [
          ...chart.blocks[startBlockIdx].notes[column].slice(0, noteIdx),
          ...chart.blocks[startBlockIdx].notes[column].slice(noteIdx + 1),
        ];
      }

      updatedChart = {
        ...chart,
        blocks: chart.blocks.map((block: Block, blockIdx: number) =>
          blockIdx === startBlockIdx
            ? {
                ...block,
                notes: block.notes.map((notes: Note[], j: number) =>
                  j === column ? updatedNotes : notes
                ),
              }
            : block
        ),
      };
    } else {
      // goalに対応する譜面のブロックのインデックスを取得
      const goalBlockIdx: number =
        mouseDownBlockIdx < mouseUpBlockIdx
          ? mouseUpBlockIdx
          : mouseDownBlockIdx;

      // startとgoalとの間にホールドを新規追加
      // ただし、その間の場所に単ノート/(中抜き)ホールドが含む場合は、それをすべて削除してから新規追加する
      updatedChart = {
        ...chart,
        blocks: chart.blocks.map((block: Block, blockIdx: number) => {
          if (blockIdx < startBlockIdx || blockIdx > goalBlockIdx) return block;

          const updatedNotes: Note[] = chart.blocks[blockIdx].notes[
            column
          ].filter((note: Note) => note.start > goal || note.goal < start);
          if (blockIdx === startBlockIdx) {
            updatedNotes.push({
              start,
              goal,
              hollowStarts: [],
              hollowGoals: [],
            });
          }

          return {
            ...block,
            notes: block.notes.map((notes: Note[], j: number) =>
              j === column ? updatedNotes : notes
            ),
          };
        }),
      };
    }

    // 譜面の更新
    setChart(updatedChart);
  };

  return { editNotes };
}

export default useEditNotes;
