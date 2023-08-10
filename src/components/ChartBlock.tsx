import { memo } from "react";
import { ChartBlockProps } from "../types/props";
import ChartBlockRectangle from "./ChartBlockRectangle";

function ChartBlock({
  chartLength,
  isEvenIdx,
  blockLength,
  split,
}: ChartBlockProps) {
  return (
    <div style={{ display: "flex", lineHeight: 0 }}>
      {[...Array(chartLength)].map((_, idx) => (
        <ChartBlockRectangle
          key={idx}
          isEvenIdx={isEvenIdx}
          blockLength={blockLength}
          split={split}
        />
      ))}
    </div>
  );
}

export default memo(ChartBlock);
