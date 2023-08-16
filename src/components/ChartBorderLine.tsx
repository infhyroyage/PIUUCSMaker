import { ChartBorderLineProps } from "../types/props";

function ChartBorderLine({ style }: ChartBorderLineProps) {
  return (
    <span
      style={{
        ...style,
        display: "block",
        backgroundColor: "rgb(11, 93, 153)",
      }}
    />
  );
}

export default ChartBorderLine;
