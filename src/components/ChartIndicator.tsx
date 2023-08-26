import { memo, useCallback, useState } from "react";
import { ChartIndicatorProps } from "../types/props";
import { Theme, useTheme } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Chart, Note } from "../types/ucs";
import { chartState, isShownSystemErrorSnackbarState } from "../service/atoms";

function ChartIndicator({
  column,
  indicatorInfo,
  noteSize,
}: ChartIndicatorProps) {
  const [mouseDownRowIdx, setMouseDownRowIdx] = useState<number | null>(null);
  const [chart, setChart] = useRecoilState<Chart | null>(chartState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const theme: Theme = useTheme();

  const onMouseDown = useCallback(() => {
    // 押下した瞬間にインディケーターが非表示である場合はNOP
    if (indicatorInfo === null) return;

    // 押下した譜面全体での行インデックスを保持
    setMouseDownRowIdx(indicatorInfo.rowIdx);
  }, [indicatorInfo, setMouseDownRowIdx]);

  const onMouseUp = useCallback(() => {
    // 押下を離した瞬間にインディケーターが非表示である/押下した譜面全体での行インデックスが初期値の場合はNOP
    if (indicatorInfo === null || mouseDownRowIdx === null) return;

    // 内部矛盾チェック
    if (chart === null) {
      setIsShownSystemErrorSnackbar(true);
      return;
    }

    // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
    const start: number =
      mouseDownRowIdx < indicatorInfo.rowIdx
        ? mouseDownRowIdx
        : indicatorInfo.rowIdx;
    const goal: number =
      mouseDownRowIdx < indicatorInfo.rowIdx
        ? indicatorInfo.rowIdx
        : mouseDownRowIdx;

    // 譜面全体での行インデックスmouseDownRowIdxで押下した後に
    // 譜面全体での行インデックスindicatorInfo.rowIdxで押下を離した際の
    // 列インデックスcolumnにて、単ノート/ホールドの追加・削除を行う
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
      updatedNotes = [
        ...chart.notes[column].filter(
          (note: Note) => note.start > goal || note.goal < start
        ),
        { start, goal },
      ];
    }
    // 単ノート/ホールドの追加・削除を行った譜面に更新
    setChart({
      ...chart,
      notes: chart.notes.map((notes: Note[], i: number) =>
        i === column ? updatedNotes : notes
      ),
    });

    // 保持していた押下した譜面全体での行インデックスを初期化
    setMouseDownRowIdx(null);
  }, [
    chart,
    indicatorInfo,
    mouseDownRowIdx,
    setChart,
    setIsShownSystemErrorSnackbar,
    setMouseDownRowIdx,
  ]);

  return (
    indicatorInfo && (
      <span
        style={{
          display: "block",
          position: "absolute",
          top: `${indicatorInfo.top}px`,
          width: `${noteSize}px`,
          height: `${noteSize}px`,
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          zIndex: theme.zIndex.drawer - 1,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    )
  );
}

export default memo(ChartIndicator);
