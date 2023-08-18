import React, { memo, useMemo } from "react";
import { ChartBlockProps } from "../types/props";
import ChartBlockRectangle from "./ChartBlockRectangle";
import useChartSizes from "../hooks/useChartSizes";
import { ZOOM_VALUES } from "../service/zoom";
import { useRecoilValue } from "recoil";
import { zoomIdxState } from "../service/atoms";
import ChartBorderLine from "./ChartBorderLine";

function ChartBlock({
  blockIdx,
  chartLength,
  blockLength,
  accumulatedBlockLength,
  split,
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
      }}
    >
      {[...Array(chartLength)].map((_, column: number) => (
        <React.Fragment key={column}>
          <ChartBorderLine
            style={{
              width: `${borderSize}px`,
              height: `${blockHeight}px`,
            }}
          />
          <ChartBlockRectangle
            column={column}
            blockIdx={blockIdx}
            blockHeight={blockHeight}
            noteSize={noteSize}
            borderSize={borderSize}
            accumulatedBlockLength={accumulatedBlockLength}
            split={split}
          />
          {column + 1 === chartLength && (
            <ChartBorderLine
              style={{
                width: `${borderSize}px`,
                height: `${blockHeight}px`,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default memo(ChartBlock);
