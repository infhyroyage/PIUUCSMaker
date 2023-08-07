import { memo } from "react";
import { ChartBlockRectangleProps } from "../types/props";
import useChartSizes from "../hooks/useChartSizes";

function ChartBlockRectangle({ blockLength }: ChartBlockRectangleProps) {
  // 単ノートの1辺、枠線のサイズを取得
  const { noteSize, borderSize } = useChartSizes();

  return (
    <span
      style={{
        display: "inline-block",
        width: `${noteSize}px`,
        height: `${noteSize * blockLength}px`, // TODO: 倍率に応じて計算
        backgroundColor: "red", // TODO: 奇数番目/偶数番目で色分け
        marginRight: `${borderSize}px`,
        marginBottom: `${borderSize}px`,
        lineHeight: 0,
        zIndex: 0,
      }}
    />
  );
}

export default memo(ChartBlockRectangle);
