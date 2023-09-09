import { memo } from "react";
import { ChartIndicatorProps } from "../types/props";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../service/assets";
import { useRecoilValue } from "recoil";
import { IndicatorInfo, MouseDownInfo } from "../types/atoms";
import { indicatorInfoState, mouseDownInfoState } from "../service/atoms";
import useChartSizes from "../hooks/useChartSizes";

function ChartIndicator({ column }: ChartIndicatorProps) {
  const indicatorInfo = useRecoilValue<IndicatorInfo | null>(
    indicatorInfoState
  );
  const mouseDownInfo = useRecoilValue<MouseDownInfo | null>(
    mouseDownInfoState
  );

  const theme: Theme = useTheme();

  // 単ノートの1辺のサイズを取得
  const { noteSize } = useChartSizes();

  return (
    indicatorInfo &&
    column === indicatorInfo.column && (
      <>
        {mouseDownInfo && column === mouseDownInfo.column && (
          <>
            {/* 押下中での単ノート/ホールドの始点の画像 */}
            <img
              src={IMAGE_BINARIES[column % 5].note}
              alt={`note${column % 5}`}
              width={noteSize}
              height={noteSize}
              style={{
                position: "absolute",
                top: `${
                  mouseDownInfo.top < indicatorInfo.top
                    ? mouseDownInfo.top
                    : indicatorInfo.top
                }px`,
                zIndex: theme.zIndex.drawer - 4,
              }}
            />
            {mouseDownInfo.rowIdx !== indicatorInfo.rowIdx && (
              <>
                {/* 押下中でのホールドの画像 */}
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
                    top: `${
                      (mouseDownInfo.top < indicatorInfo.top
                        ? mouseDownInfo.top
                        : indicatorInfo.top) +
                      noteSize * 0.5
                    }px`,
                    zIndex: theme.zIndex.drawer - 2,
                  }}
                />
                {/* 押下中でのホールドの終点の画像 */}
                <img
                  src={IMAGE_BINARIES[column % 5].note}
                  alt={`note${column % 5}`}
                  width={noteSize}
                  height={noteSize}
                  style={{
                    position: "absolute",
                    top: `${
                      mouseDownInfo.top < indicatorInfo.top
                        ? indicatorInfo.top
                        : mouseDownInfo.top
                    }px`,
                    zIndex: theme.zIndex.drawer - 3,
                  }}
                />
              </>
            )}
          </>
        )}
        {/* インディケーター */}
        <span
          style={{
            display: "block",
            position: "absolute",
            top: `${indicatorInfo.top}px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor: "rgba(170, 170, 170, 0.5)",
            zIndex: theme.zIndex.drawer - 1,
          }}
        />
      </>
    )
  );
}

export default memo(ChartIndicator);
