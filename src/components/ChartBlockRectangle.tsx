import { memo, useMemo } from "react";
import { ChartBlockRectangleProps } from "../types/props";
import useChartSizes from "../hooks/useChartSizes";
import { useRecoilValue } from "recoil";
import { zoomIdxState } from "../service/atoms";
import { ZOOM_VALUES } from "../service/zoom";

function ChartBlockRectangle({
  isEvenIdx,
  blockLength,
  split,
}: ChartBlockRectangleProps) {
  const zoomIdx: number = useRecoilValue<number>(zoomIdxState);

  // 単ノートの1辺、枠線のサイズを取得
  const { noteSize, borderSize } = useChartSizes();

  const blockHeight: number = useMemo(
    () => (2.0 * noteSize * ZOOM_VALUES[zoomIdx] * blockLength) / split,
    [blockLength, noteSize, split, zoomIdx]
  );

  return (
    <span
      style={{
        display: "inline-block",
        width: `${noteSize}px`,
        height: `${blockHeight}px`,
        backgroundColor: isEvenIdx ? "#ffffaa" : "#aaffff",
        marginRight: `${borderSize}px`,
        marginBottom: `${borderSize}px`,
        lineHeight: 0,
        zIndex: 0,
      }}
    />
  );
}

export default memo(ChartBlockRectangle);
