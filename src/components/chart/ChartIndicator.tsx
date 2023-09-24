import { MouseEvent, memo, useCallback } from "react";
import { ChartIndicatorProps } from "../../types/props";
import { PopoverPosition, Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartIndicatorMenuPositionState,
  noteSizeState,
} from "../../service/atoms";
import ChartIndicatorMenu from "./ChartIndicatorMenu";

function ChartIndicator({ column, indicator, mouseDown }: ChartIndicatorProps) {
  const noteSize = useRecoilValue<number>(noteSizeState);
  const setPosition = useSetRecoilState<PopoverPosition | undefined>(
    chartIndicatorMenuPositionState
  );

  const theme: Theme = useTheme();

  // 右クリックしたマウスの座標にChartIndicatorMenuを表示
  const handleRightClick = useCallback(
    (event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>) => {
      event.preventDefault();
      setPosition({
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setPosition]
  );

  return (
    indicator && (
      <>
        {/* 押下中でのホールドのみ画像を表示する(単ノートは表示しない) */}
        {mouseDown && mouseDown.rowIdx !== indicator.rowIdx && (
          <>
            <img
              src={IMAGE_BINARIES[column % 5].note}
              alt={`note${column % 5}`}
              width={noteSize}
              height={noteSize}
              style={{
                position: "absolute",
                top: Math.min(indicator.top, mouseDown.top),
                zIndex: theme.zIndex.drawer - 4,
              }}
            />
            <img
              src={IMAGE_BINARIES[column % 5].hold}
              alt={`hold${column % 5}`}
              width={noteSize}
              height={Math.abs(indicator.top - mouseDown.top)}
              style={{
                position: "absolute",
                top: Math.min(indicator.top, mouseDown.top) + noteSize * 0.5,
                zIndex: theme.zIndex.drawer - 3,
              }}
            />
            <img
              src={IMAGE_BINARIES[column % 5].note}
              alt={`note${column % 5}`}
              width={noteSize}
              height={noteSize}
              style={{
                position: "absolute",
                top: Math.max(indicator.top, mouseDown.top),
                zIndex: theme.zIndex.drawer - 2,
              }}
            />
          </>
        )}
        <span
          onContextMenu={handleRightClick}
          style={{
            display: "block",
            position: "absolute",
            top: indicator.top,
            width: noteSize,
            height: noteSize,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            zIndex: theme.zIndex.drawer - 1,
          }}
        />
        <ChartIndicatorMenu />
      </>
    )
  );
}

export default memo(ChartIndicator);
