import { useRecoilValue } from "recoil";
import { chartState, noteSizeState, zoomState } from "../service/atoms";
import { ChartVerticalRectanglesProps } from "../types/props";
import { Chart } from "../types/ucs";
import ChartBorderLine from "./ChartBorderLine";
import ChartRectangle from "./ChartRectangle";
import { memo, useMemo } from "react";
import { ZOOM_VALUES } from "../service/zoom";
import { Zoom } from "../types/atoms";

function ChartVerticalRectangles({ blockIdx }: ChartVerticalRectanglesProps) {
  const chart = useRecoilValue<Chart>(chartState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

  // 枠線のサイズをnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize = useMemo(
    () => (noteSize > 20 ? Math.floor(noteSize / 20) : 1),
    [noteSize]
  );

  // 最後の譜面のブロック以外の場合は、下部に境界線を配置
  return blockIdx === chart.blocks.length - 1 ? (
    <ChartRectangle
      blockIdx={blockIdx}
      height={
        (2.0 *
          noteSize *
          ZOOM_VALUES[zoom.idx] *
          chart.blocks[blockIdx].length) /
        chart.blocks[blockIdx].split
      }
    />
  ) : (
    <>
      <ChartRectangle
        blockIdx={blockIdx}
        height={
          (2.0 *
            noteSize *
            ZOOM_VALUES[zoom.idx] *
            chart.blocks[blockIdx].length) /
            chart.blocks[blockIdx].split -
          borderSize
        }
      />
      <ChartBorderLine width={noteSize} height={borderSize} />
    </>
  );
}

export default memo(ChartVerticalRectangles);
