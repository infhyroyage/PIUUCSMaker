import { memo, useMemo } from "react";
import { ChartBlockProps } from "../types/props";
import ChartBlockRectangle from "./ChartBlockRectangle";
import useChartSizes from "../hooks/useChartSizes";
import { ZOOM_VALUES } from "../service/zoom";
import { useRecoilValue } from "recoil";
import { zoomIdxState } from "../service/atoms";

function ChartBlock({
  chartLength,
  isEvenIdx,
  blockLength,
  accumulatedBlockLength,
  split,
  notes,
}: ChartBlockProps) {
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);

  // 単ノートの1辺、枠線のサイズを取得
  const { noteSize, borderSize } = useChartSizes();

  /**
   * 譜面のブロックの縦のサイズ(blockHeight)をpx単位で計算
   * blockHeight := 2 * noteSize * 倍率 * 譜面のブロックの行数 / 譜面のブロックのSplit
   */
  const blockHeight: number = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * blockLength) / split,
    [blockLength, noteSize, split, zoomIdx]
  );

  return (
    <div
      style={{
        display: "flex",
        lineHeight: 0,
        height: `${blockHeight}px`,
        marginBottom: `${borderSize}px`,
      }}
    >
      {[...Array(chartLength)].map((_, column: number) => (
        <ChartBlockRectangle
          key={column}
          column={column}
          isEvenIdx={isEvenIdx}
          blockLength={blockLength}
          noteSize={noteSize}
          borderSize={borderSize}
          accumulatedBlockLength={accumulatedBlockLength}
          split={split}
          notes={notes[column]}
        />
      ))}
    </div>
  );
}

export default memo(ChartBlock);
