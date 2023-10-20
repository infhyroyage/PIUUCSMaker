import { useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue } from "recoil";
import {
  indicatorState,
  mouseDownState,
  noteSizeState,
  selectorState,
} from "../../service/atoms";
import { Indicator, MouseDown, Selector } from "../../types/ui";
import { IDENTIFIER_WIDTH } from "../../service/styles";

function ChartIndicator() {
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const mouseDown = useRecoilValue<MouseDown>(mouseDownState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const selector = useRecoilValue<Selector>(selectorState);

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  const theme: Theme = useTheme();

  return (
    indicator !== null && (
      <>
        {mouseDown !== null && indicator.column === mouseDown.column && (
          <>
            {(mouseDown.isSettingByMenu ||
              indicator.rowIdx !== mouseDown.rowIdx) && (
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={`${noteSize}px`}
                height={`${noteSize}px`}
                style={{
                  position: "absolute",
                  top: `${Math.min(indicator.top, mouseDown.top)}px`,
                  left: `${
                    IDENTIFIER_WIDTH +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column
                  }px`,
                  opacity: mouseDown.isSettingByMenu ? 0.5 : 1,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: theme.zIndex.appBar - 4,
                }}
              />
            )}
            {indicator.rowIdx !== mouseDown.rowIdx && (
              <>
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
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column
                    }px`,
                    opacity: mouseDown.isSettingByMenu ? 0.5 : 1,
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
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column
                    }px`,
                    opacity: mouseDown.isSettingByMenu ? 0.5 : 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: theme.zIndex.appBar - 2,
                  }}
                />
              </>
            )}
          </>
        )}
        <span
          style={{
            position: "absolute",
            top: `${indicator.top}px`,
            left: `${
              IDENTIFIER_WIDTH +
              verticalBorderSize * 0.5 +
              noteSize * indicator.column
            }px`,
            width: `${noteSize}px`,
            height: `${noteSize}px`,
            backgroundColor:
              mouseDown && mouseDown.isSettingByMenu
                ? "rgba(255, 170, 170, 0.5)"
                : selector.changingCords &&
                  selector.changingCords.isSettingByMenu
                ? "rgba(255, 170, 255, 0.5)"
                : "rgba(170, 170, 255, 0.5)",
            pointerEvents: "none",
            zIndex: theme.zIndex.appBar - 1,
          }}
        />
      </>
    )
  );
}

export default ChartIndicator;
