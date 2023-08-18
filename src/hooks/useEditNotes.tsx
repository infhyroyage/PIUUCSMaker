import { useRecoilState, useSetRecoilState } from "recoil";
import { Block, Chart, Note } from "../types/ucs";
import { chartState, isShownSystemErrorSnackbarState } from "../service/atoms";

function useEditNotes() {
  const [chart, setChart] = useRecoilState<Chart | undefined>(chartState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  // blockIdx番目の譜面のブロック、列インデックスcolumnにて、
  // 譜面全体での行インデックスmouseDownRowIdxで押下した後に
  // 譜面全体での行インデックスmouseUpRowIdxで押下を離した際の
  // 単ノート/(中抜き)ホールドの追加・削除を行う
  const editNotes = (
    blockIdx: number,
    column: number,
    mouseDownRowIdx: number,
    mouseUpRowIdx: number
  ) => {
    // 内部矛盾チェック
    if (!chart) {
      setIsShownSystemErrorSnackbar(true);
      return;
    }

    let updatedColumnNotes: Note[] = [...chart.blocks[blockIdx].notes[column]];
    if (mouseDownRowIdx === mouseUpRowIdx) {
      // mouseUpRowIdxの場所に単ノートを追加
      // ただし、その場所に単ノート/(中抜き)ホールドが含む場合は追加せず、それを削除する
      const noteIdx: number = chart.blocks[blockIdx].notes[column].findIndex(
        (note: Note) =>
          note.start <= mouseUpRowIdx && mouseUpRowIdx <= note.goal
      );
      if (noteIdx === -1) {
        updatedColumnNotes.push({
          start: mouseUpRowIdx,
          goal: mouseUpRowIdx,
          hollowStarts: [],
          hollowGoals: [],
        });
      } else {
        updatedColumnNotes = [
          ...chart.blocks[blockIdx].notes[column].slice(0, noteIdx),
          ...chart.blocks[blockIdx].notes[column].slice(noteIdx + 1),
        ];
      }
    } else {
      // mouseDownRowIdx〜mouseUpRowIdx/mouseUpRowIdx〜mouseDownRowIdxの場所にホールドを追加
      // TODO: 中抜きホールドの追加は未実装
      console.log({ mouseDownRowIdx, mouseUpRowIdx });
    }

    // 譜面の更新
    setChart({
      ...chart,
      blocks: chart.blocks.map((block: Block, i: number) =>
        i === blockIdx
          ? {
              ...block,
              notes: block.notes.map((columnNotes: Note[], j: number) =>
                j === column ? updatedColumnNotes : columnNotes
              ),
            }
          : block
      ),
    });
  };

  return { editNotes };
}

export default useEditNotes;
