import { memo } from "react";
import { ChartIndicatorProps } from "../types/props";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../service/assets";
import { useRecoilValue } from "recoil";
import { IndicatorInfo, MouseDownInfo } from "../types/atoms";
import {
  indicatorInfoState,
  mouseDownInfoState,
  noteSizeState,
} from "../service/atoms";

function ChartIndicator({ column }: ChartIndicatorProps) {
  const indicatorInfo = useRecoilValue<IndicatorInfo | null>(
    indicatorInfoState
  );
  const mouseDownInfo = useRecoilValue<MouseDownInfo | null>(
    mouseDownInfoState
  );
  const noteSize = useRecoilValue<number>(noteSizeState);

  const theme: Theme = useTheme();

  return (
    indicatorInfo &&
    column === indicatorInfo.column && (
      <>
        {/* 押下中でのホールドのみ画像を表示する(単ノートは表示しない) */}
        {mouseDownInfo &&
          column === mouseDownInfo.column &&
          mouseDownInfo.rowIdx !== indicatorInfo.rowIdx && (
            <>
              <img
                src={IMAGE_BINARIES[column % 5].note}
                alt={`note${column % 5}`}
                width={noteSize}
                height={noteSize}
                style={{
                  position: "absolute",
                  top:
                    mouseDownInfo.top < indicatorInfo.top
                      ? mouseDownInfo.top
                      : indicatorInfo.top,
                  zIndex: theme.zIndex.drawer - 4,
                }}
              />
              <img
                src={IMAGE_BINARIES[column % 5].hold}
                alt={`hold${column % 5}`}
                width={noteSize}
                height={
                  mouseDownInfo.top < indicatorInfo.top
                    ? indicatorInfo.top - mouseDownInfo.top
                    : mouseDownInfo.top - indicatorInfo.top
                }
                style={{
                  position: "absolute",
                  top:
                    (mouseDownInfo.top < indicatorInfo.top
                      ? mouseDownInfo.top
                      : indicatorInfo.top) +
                    noteSize * 0.5,
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
                  top:
                    mouseDownInfo.top < indicatorInfo.top
                      ? indicatorInfo.top
                      : mouseDownInfo.top,
                  zIndex: theme.zIndex.drawer - 2,
                }}
              />
            </>
          )}
        <span
          style={{
            display: "block",
            position: "absolute",
            top: indicatorInfo.top,
            width: noteSize,
            height: noteSize,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            zIndex: theme.zIndex.drawer - 1,
          }}
        />
      </>
    )
  );
}

export default memo(ChartIndicator);
