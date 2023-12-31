import { Theme, useTheme } from "@mui/material";
import { useRecoilValue } from "recoil";
import {
  indicatorState,
  holdSetterState,
  noteSizeState,
  selectorState,
} from "../../services/atoms";
import { Indicator, HoldSetter, Selector } from "../../types/chart";
import { IDENTIFIER_WIDTH } from "../../services/styles";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { HOLD_BINARIES, NOTE_BINARIES } from "../../services/assets";

function ChartIndicator() {
  const holdSetter = useRecoilValue<HoldSetter>(holdSetterState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const selector = useRecoilValue<Selector>(selectorState);

  const theme: Theme = useTheme();

  const verticalBorderSize = useVerticalBorderSize();

  return (
    indicator !== null && (
      <>
        {holdSetter !== null && indicator.column === holdSetter.column && (
          <>
            {(holdSetter.isSettingByMenu ||
              indicator.rowIdx !== holdSetter.rowIdx) && (
              <img
                src={NOTE_BINARIES[indicator.column % 5]}
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
                  src={HOLD_BINARIES[indicator.column % 5]}
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
                  src={NOTE_BINARIES[indicator.column % 5]}
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
                : selector.isSettingByMenu
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
