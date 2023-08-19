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
    // start/goalに対応する譜面のブロックのインデックスを取得
    const startBlocklIdx: number =
      mouseDownBlockIdx < mouseUpBlockIdx ? mouseDownBlockIdx : mouseUpBlockIdx;
    const goalBlocklIdx: number =
      mouseDownBlockIdx < mouseUpBlockIdx ? mouseUpBlockIdx : mouseDownBlockIdx;

    let updatedStartBlockIdxNotes: Note[] = [
      ...chart.blocks[startBlocklIdx].notes[column],
    ];
    if (start === goal) {
      // startの場所に単ノートを追加
      // ただし、その場所に単ノート/(中抜き)ホールドが含む場合は追加せず、それを削除する
      const noteIdx: number = chart.blocks[startBlocklIdx].notes[
        column
      ].findIndex((note: Note) => note.start <= start && start <= note.goal);
      if (noteIdx === -1) {
        updatedStartBlockIdxNotes.push({
          start,
          goal,
          hollowStarts: [],
          hollowGoals: [],
        });
      } else {
        updatedStartBlockIdxNotes = [
          ...chart.blocks[startBlocklIdx].notes[column].slice(0, noteIdx),
          ...chart.blocks[startBlocklIdx].notes[column].slice(noteIdx + 1),
        ];
      }
    } else {
      // TODO: startとgoalとの間にホールドを追加
      // TODO: 中抜きホールドの追加は未実装
      console.log({
        start,
        goal,
        startBlocklIdx,
        goalBlocklIdx,
      });
      return;
    }

    // 譜面の更新
    setChart({
      ...chart,
      blocks: chart.blocks.map((block: Block, i: number) =>
        i === startBlocklIdx
          ? {
              ...block,
              notes: block.notes.map((columnNotes: Note[], j: number) =>
                j === column ? updatedStartBlockIdxNotes : columnNotes
              ),
            }
          : block
      ),
    });
  };

  return { editNotes };
}

export default useEditNotes;
