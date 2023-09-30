import { memo, useMemo } from "react";
import { ChartIndicatorProps } from "../../types/props";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue } from "recoil";
import {
  noteSizeState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";

function ChartIndicator({ indicator }: ChartIndicatorProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );

  // 縦の枠線のサイズ(px単位)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  const theme: Theme = useTheme();

  return (
    indicator !== null && (
      <>
        {/* 押下中でのホールドのみ画像を表示する(単ノートは表示しない) */}
        {indicator.column === indicator.mouseDownColumn &&
          indicator.rowIdx !== indicator.mouseDownRowIdx &&
          indicator.mouseDownTop !== null && (
            <>
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={noteSize}
                height={noteSize}
                style={{
                  position: "absolute",
                  top: Math.min(indicator.top, indicator.mouseDownTop),
                  left:
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column,
                  pointerEvents: "none",
                  zIndex: theme.zIndex.drawer - 4,
                }}
              />
              <img
                src={IMAGE_BINARIES[indicator.column % 5].hold}
                alt={`hold${indicator.column % 5}`}
                width={noteSize}
                height={Math.abs(indicator.top - indicator.mouseDownTop)}
                style={{
                  position: "absolute",
                  top:
                    Math.min(indicator.top, indicator.mouseDownTop) +
                    noteSize * 0.5,
                  left:
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column,
                  pointerEvents: "none",
                  zIndex: theme.zIndex.drawer - 3,
                }}
              />
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={noteSize}
                height={noteSize}
                style={{
                  position: "absolute",
                  top: Math.max(indicator.top, indicator.mouseDownTop),
                  left:
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column,
                  pointerEvents: "none",
                  zIndex: theme.zIndex.drawer - 2,
                }}
              />
            </>
          )}
        <span
          style={{
            position: "absolute",
            top: indicator.top,
            left:
              rectangleIdentifierWidth +
              verticalBorderSize * 0.5 +
              noteSize * indicator.column,
            width: noteSize,
            height: noteSize,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            pointerEvents: "none",
            zIndex: theme.zIndex.drawer - 1,
          }}
        />
      </>
    )
  );
}

export default memo(ChartIndicator);
