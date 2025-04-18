import { useStore } from "../../hooks/useStore";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { HOLD_BINARIES, NOTE_BINARIES } from "../../services/assets";
import {
  IDENTIFIER_WIDTH,
  NAVIGATION_BAR_Z_INDEX,
} from "../../services/styles";

function ChartIndicator() {
  const { holdSetter, indicator, noteSize, selector } = useStore();

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
                style={{
                  width: noteSize,
                  height: noteSize,
                  position: "absolute",
                  top: Math.min(indicator.top, holdSetter.top),
                  left:
                    IDENTIFIER_WIDTH +
                    verticalBorderSize * 0.5 +
                    noteSize * indicator.column,
                  opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: NAVIGATION_BAR_Z_INDEX - 4,
                }}
              />
            )}
            {indicator.rowIdx !== holdSetter.rowIdx && (
              <>
                <img
                  src={HOLD_BINARIES[indicator.column % 5]}
                  alt={`hold${indicator.column % 5}`}
                  style={{
                    width: noteSize,
                    height: Math.abs(indicator.top - holdSetter.top),
                    position: "absolute",
                    top:
                      Math.min(indicator.top, holdSetter.top) + noteSize * 0.5,
                    left:
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column,
                    opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: NAVIGATION_BAR_Z_INDEX - 3,
                  }}
                />
                <img
                  src={NOTE_BINARIES[indicator.column % 5]}
                  alt={`note${indicator.column % 5}`}
                  style={{
                    width: noteSize,
                    height: noteSize,
                    position: "absolute",
                    top: Math.max(indicator.top, holdSetter.top),
                    left:
                      IDENTIFIER_WIDTH +
                      verticalBorderSize * 0.5 +
                      noteSize * indicator.column,
                    opacity: holdSetter.isSettingByMenu ? 0.5 : 1,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: NAVIGATION_BAR_Z_INDEX - 2,
                  }}
                />
              </>
            )}
          </>
        )}
        <span
          style={{
            width: noteSize,
            height: noteSize,
            position: "absolute",
            top: indicator.top,
            left:
              IDENTIFIER_WIDTH +
              verticalBorderSize * 0.5 +
              noteSize * indicator.column,
            backgroundColor:
              holdSetter && holdSetter.isSettingByMenu
                ? "rgba(255, 170, 170, 0.5)"
                : selector.isSettingByMenu
                ? "rgba(255, 170, 255, 0.5)"
                : "rgba(170, 170, 255, 0.5)",
            pointerEvents: "none",
            zIndex: NAVIGATION_BAR_Z_INDEX - 1,
          }}
        />
      </>
    )
  );
}

export default ChartIndicator;
