import { memo } from "react";
import { BorderLineProps } from "../types/props";

function BorderLine({ style }: BorderLineProps) {
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

export default memo(BorderLine);
