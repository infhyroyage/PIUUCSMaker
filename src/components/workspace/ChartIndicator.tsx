import { useMemo } from "react";
import { Theme, useTheme } from "@mui/material";
import { IMAGE_BINARIES } from "../../service/assets";
import { useRecoilValue } from "recoil";
import {
  indicatorState,
  holdSetterState,
  noteSizeState,
  selectorState,
} from "../../service/atoms";
import { Indicator, HoldSetter, Selector } from "../../types/ui";
import { IDENTIFIER_WIDTH } from "../../service/styles";

function ChartIndicator() {
  const holdSetter = useRecoilValue<HoldSetter>(holdSetterState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
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
        {holdSetter !== null && indicator.column === holdSetter.column && (
          <>
            {(holdSetter.isSettingByMenu ||
              indicator.rowIdx !== holdSetter.rowIdx) && (
              <img
                src={IMAGE_BINARIES[indicator.column % 5].note}
                alt={`note${indicator.column % 5}`}
                width={`${noteSize}px`}
                height={`${noteSize}px`}
                style={{
                  position: "absolute",
                  top: `${Math.min(indicator.top, holdSetter.top)}px`,
                  left: `${
                    IDENTIFIER_WIDTH +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column
                  }px`,
                  opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: theme.zIndex.appBar - 4,
                }}
              />
            )}
            {indicator.rowIdx !== holdSetter.rowIdx && (
              <>
                <img
                  src={IMAGE_BINARIES[indicator.column % 5].hold}
                  alt={`hold${indicator.column % 5}`}
                  width={`${noteSize}px`}
                  height={`${Math.abs(indicator.top - holdSetter.top)}px`}
                  style={{
                    position: "absolute",
                    top: `${
                      Math.min(indicator.top, holdSetter.top) + noteSize * 0.5
                    }px`,
                    left: `${
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column
                    }px`,
                    opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
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
                    top: `${Math.max(indicator.top, holdSetter.top)}px`,
                    left: `${
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column
                    }px`,
                    opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
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
              holdSetter && holdSetter.isSettingByMenu
                ? "rgba(255, 170, 170, 0.5)"
                : selector.setting && selector.setting.isSettingByMenu
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
