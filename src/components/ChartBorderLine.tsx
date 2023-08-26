import { memo } from "react";
import { ChartBorderLineProps } from "../types/props";

function ChartBorderLine({ height, width }: ChartBorderLineProps) {
  return (
    <span
      style={{
        width,
        height,
        display: "block",
        backgroundColor: "rgb(11, 93, 153)",
      }}
    />
  );
}

export default memo(ChartBorderLine);
