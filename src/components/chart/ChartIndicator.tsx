import { memo, useMemo } from "react";
import { ChartIndicatorProps } from "../../types/props";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue } from "recoil";
import {
  noteSizeState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";

function ChartIndicator({ indicator, mouseDown }: ChartIndicatorProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const rectangleIdentifierWidth = useRecoilValue<number>(
    rectangleIdentifierWidthState
  );
  console.log({ indicator, mouseDown });

  // 枠線のサイズ(px単位)をnoteSizeの0.05倍(小数点以下切り捨て、最小値は1)として計算
  const borderSize: number = useMemo(
    () => Math.max(Math.floor(noteSize / 20), 1),
    [noteSize]
  );

  const theme: Theme = useTheme();

  return (
    indicator && (
      <>
        {/* 押下中でのホールドのみ画像を表示する(単ノートは表示しない) */}
        {mouseDown &&
          mouseDown.column === indicator.column &&
          mouseDown.rowIdx !== indicator.rowIdx && (
            <>
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={noteSize}
                height={noteSize}
                style={{
                  position: "absolute",
                  top: Math.min(indicator.top, mouseDown.top),
                  left:
                    rectangleIdentifierWidth +
                    borderSize +
                    (borderSize + noteSize) * indicator.column,
                  pointerEvents: "none",
                  zIndex: theme.zIndex.drawer - 4,
                }}
              />
              <img
                src={IMAGE_BINARIES[indicator.column % 5].hold}
                alt={`hold${indicator.column % 5}`}
                width={noteSize}
                height={Math.abs(indicator.top - mouseDown.top)}
                style={{
                  position: "absolute",
                  top: Math.min(indicator.top, mouseDown.top) + noteSize * 0.5,
                  left:
                    rectangleIdentifierWidth +
                    borderSize +
                    (borderSize + noteSize) * indicator.column,
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
                  top: Math.max(indicator.top, mouseDown.top),
                  left:
                    rectangleIdentifierWidth +
                    borderSize +
                    (borderSize + noteSize) * indicator.column,
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
              borderSize +
              (borderSize + noteSize) * indicator.column,
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
