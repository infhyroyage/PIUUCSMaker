import { memo, useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  noteSizeState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";
import { ChartSelectorProps } from "../../types/props";

function ChartSelector({ cords }: ChartSelectorProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );

  // 縦の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は1)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 1),
    [noteSize]
  );

  const theme: Theme = useTheme();

  return (
    cords.mouseUpColumn !== null &&
    cords.mouseUpTop !== null && (
      <span
        style={{
          position: "absolute",
          top: Math.min(cords.mouseDownTop, cords.mouseUpTop),
          left:
            rectangleIdentifierWidth +
            verticalBorderSize +
            (verticalBorderSize + noteSize) *
              Math.min(cords.mouseDownColumn, cords.mouseUpColumn),
          width:
            (verticalBorderSize + noteSize) *
              (Math.max(cords.mouseDownColumn, cords.mouseUpColumn) +
                1 -
                Math.min(cords.mouseDownColumn, cords.mouseUpColumn)) -
            verticalBorderSize,
          height:
            Math.max(cords.mouseDownTop, cords.mouseUpTop) +
            noteSize -
            Math.min(cords.mouseDownTop, cords.mouseUpTop),
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: theme.zIndex.drawer - 5,
        }}
      />
    )
  );
}

export default memo(ChartSelector);
