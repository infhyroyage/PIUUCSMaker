import { useMemo } from "react";
import { useStore } from "../../hooks/useStore";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { ZOOM_VALUES } from "../../services/assets";
import {
  IDENTIFIER_WIDTH,
  NAVIGATION_BAR_Z_INDEX,
} from "../../services/styles";
import { Block } from "../../types/ucs";

function ChartSelector() {
  const { blocks, noteSize, selector, zoom } = useStore();

  const verticalBorderSize = useVerticalBorderSize();

  // Calculate column index at the top left of the selection area (null if not displayed)
  const startColumn = useMemo(
    () =>
      selector.completed !== null
        ? selector.completed.startColumn
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.min(
            selector.setting.mouseDownColumn,
            selector.setting.mouseUpColumn
          )
        : null,
    [selector.completed, selector.setting]
  );

  // Calculate left (px) of the selection area (null if not displayed)
  const left = useMemo(() => {
    if (startColumn === null) return null;

    return IDENTIFIER_WIDTH + verticalBorderSize * 0.5 + noteSize * startColumn;
  }, [noteSize, startColumn, verticalBorderSize]);

  // Calculate top (px) of the selection area (null if not displayed)
  const top = useMemo(() => {
    // Calculate row index in the entire chart at the top left of the selection area
    const startRowIdx: number | null =
      selector.completed !== null
        ? selector.completed.startRowIdx
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.min(
            selector.setting.mouseDownRowIdx,
            selector.setting.mouseUpRowIdx
          )
        : null;
    if (startRowIdx === null) return null;

    let top: number = 0;
    blocks.some((block: Block) => {
      // Height (px) per row of the chart block
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (startRowIdx < block.accumulatedRows + block.rows) {
        top += unitRowHeight * (startRowIdx - block.accumulatedRows);
        return true;
      } else {
        top += unitRowHeight * block.rows;
        return false;
      }
    });
    return top;
  }, [blocks, noteSize, selector.completed, selector.setting, zoom.idx]);

  // Calculate width (px) of the selection area (null if not displayed)
  const width = useMemo(() => {
    if (startColumn === null) return null;

    // Calculate column index at the bottom right of the selection area (null if not displayed)
    const goalColumn: number | null =
      selector.completed !== null
        ? selector.completed.goalColumn
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.max(
            selector.setting.mouseDownColumn,
            selector.setting.mouseUpColumn
          )
        : null;
    if (goalColumn === null) return null;

    return noteSize * (goalColumn + 1 - startColumn);
  }, [noteSize, selector.completed, selector.setting, startColumn]);

  // Calculate height (px) of the selection area (null if not displayed)
  const height = useMemo(() => {
    if (top === null) return null;

    // Calculate row index in the entire chart at the bottom right of the selection area
    const goalRowIdx: number | null =
      selector.completed !== null
        ? selector.completed.goalRowIdx
        : selector.setting !== null &&
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ? Math.max(
            selector.setting.mouseDownRowIdx,
            selector.setting.mouseUpRowIdx
          )
        : null;
    if (goalRowIdx === null) return null;

    // Calculate top (px) at the bottom of the selection area
    let goalTop: number = 0;
    blocks.some((block: Block) => {
      // Height (px) per row of the chart block
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;

      if (goalRowIdx < block.accumulatedRows + block.rows) {
        goalTop += unitRowHeight * (goalRowIdx - block.accumulatedRows);
        return true;
      } else {
        goalTop += unitRowHeight * block.rows;
        return false;
      }
    });

    return goalTop + noteSize - top;
  }, [blocks, noteSize, selector.completed, selector.setting, top, zoom.idx]);

  return (
    left !== null &&
    top !== null &&
    width !== null &&
    height !== null && (
      <span
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "rgba(170, 170, 170, 0.5)",
          pointerEvents: "none",
          zIndex: NAVIGATION_BAR_Z_INDEX - 5,
        }}
      />
    )
  );
}

export default ChartSelector;
