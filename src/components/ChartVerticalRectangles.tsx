import { useRecoilValue } from "recoil";
import { noteSizeState } from "../service/atoms";
import { ChartVerticalRectanglesProps } from "../types/props";
import ChartBorderLine from "./ChartBorderLine";
import ChartRectangle from "./ChartRectangle";
import { memo, useMemo } from "react";

function ChartVerticalRectangles({
  blockHeight,
  blockIdx,
  isLastBlock,
}: ChartVerticalRectanglesProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);

  // 枠線のサイズをnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize = useMemo(
    () => (noteSize > 20 ? Math.floor(noteSize / 20) : 1),
    [noteSize]
  );

  // 最後の譜面のブロック以外の場合は、下部に境界線を配置
  return isLastBlock ? (
    <ChartRectangle blockIdx={blockIdx} height={blockHeight} />
  ) : (
    <>
      <ChartRectangle blockIdx={blockIdx} height={blockHeight - borderSize} />
      <ChartBorderLine width={noteSize} height={borderSize} />
    </>
  );
}

export default memo(ChartVerticalRectangles);
