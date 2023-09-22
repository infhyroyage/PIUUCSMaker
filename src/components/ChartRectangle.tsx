import { memo } from "react";
import { ChartRectangleProps } from "../types/props";

function ChartRectangle({ height, isEven }: ChartRectangleProps) {
  return (
    <span
      style={{
        width: "100%",
        height,
        backgroundColor: isEven ? "rgb(255, 255, 170)" : "rgb(170, 255, 255)",
      }}
    />
  );
}

export default memo(ChartRectangle);
