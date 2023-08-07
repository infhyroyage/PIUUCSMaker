import { memo } from "react";
import { ChartBlockProps } from "../types/props";
import ChartBlockRectangle from "./ChartBlockRectangle";

function ChartBlock({ chartLength, blockLength }: ChartBlockProps) {
  return (
    <div style={{ display: "flex", lineHeight: 0 }}>
      {[...Array(chartLength)].map((_, idx) => (
        <ChartBlockRectangle key={idx} blockLength={blockLength} />
      ))}
    </div>
  );
}

export default memo(ChartBlock);
