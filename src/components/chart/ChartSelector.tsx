import { useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  noteSizeState,
  rectangleIdentifierWidthState,
  selectorState,
} from "../../service/atoms";
import { Selector } from "../../types/chart";

function ChartSelector() {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const selector = useRecoilValue<Selector>(selectorState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize: number = useMemo(
    () => Math.max(Math.floor(noteSize / 20), 1),
    [noteSize]
  );

  const theme: Theme = useTheme();

  return (
    selector && (
      <span
        style={{
          position: "absolute",
          top: selector.startTop,
          left:
            rectangleIdentifierWidth +
            borderSize +
            (borderSize + noteSize) * selector.startColumn,
          width:
            (borderSize + noteSize) *
              (selector.goalColumn + 1 - selector.startColumn) -
            borderSize,
          height: selector.goalTop + noteSize - selector.startTop,
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: theme.zIndex.drawer - 5,
        }}
      />
    )
  );
}

export default ChartSelector;
