import { memo } from "react";
import { ChartRectangleProps } from "../types/props";

function ChartRectangle({ blockIdx, height }: ChartRectangleProps) {
  return (
    <span
      style={{
        width: "100%",
        height,
        backgroundColor:
          blockIdx % 2 === 0 ? "rgb(255, 255, 170)" : "rgb(170, 255, 255)",
      }}
    />
  );
}

export default memo(ChartRectangle);
