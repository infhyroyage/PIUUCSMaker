import { useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue } from "recoil";
import {
  indicatorState,
  mouseDownState,
  noteSizeState,
  rectangleIdentifierWidthState,
} from "../../service/atoms";
import { Indicator, MouseDown } from "../../types/ui";

function ChartIndicator() {
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const mouseDown = useRecoilValue<MouseDown>(mouseDownState);
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
        {mouseDown !== null &&
          indicator.column === mouseDown.column &&
          indicator.rowIdx !== mouseDown.rowIdx && (
            <>
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={`${noteSize}px`}
                height={`${noteSize}px`}
                style={{
                  position: "absolute",
                  top: `${Math.min(indicator.top, mouseDown.top)}px`,
                  left: `${
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column
                  }px`,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: theme.zIndex.appBar - 4,
                }}
              />
              <img
                src={IMAGE_BINARIES[indicator.column % 5].hold}
                alt={`hold${indicator.column % 5}`}
                width={`${noteSize}px`}
                height={`${Math.abs(indicator.top - mouseDown.top)}px`}
                style={{
                  position: "absolute",
                  top: `${
                    Math.min(indicator.top, mouseDown.top) + noteSize * 0.5
                  }px`,
                  left: `${
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column
                  }px`,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: theme.zIndex.appBar - 3,
                }}
              />
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={`${noteSize}px`}
                height={`${noteSize}px`}
                style={{
                  position: "absolute",
                  top: `${Math.max(indicator.top, mouseDown.top)}px`,
                  left: `${
                    rectangleIdentifierWidth +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column
                  }px`,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: theme.zIndex.appBar - 2,
                }}
              />
            </>
          )}
        <span
          style={{
            position: "absolute",
            top: `${indicator.top}px`,
            left: `${
              rectangleIdentifierWidth +
              verticalBorderSize * 0.5 +
              noteSize * indicator.column
            }px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            pointerEvents: "none",
            zIndex: theme.zIndex.appBar - 1,
          }}
        />
      </>
    )
  );
}

export default ChartIndicator;
