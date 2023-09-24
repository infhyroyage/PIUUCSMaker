import { memo } from "react";
import { BorderLineProps } from "../types/props";

function BorderLine({ height, width }: BorderLineProps) {
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

export default memo(BorderLine);
