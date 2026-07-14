import React, { useCallback, useMemo } from "react";
import { useStore } from "../../hooks/useStore";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { ZOOM_VALUES } from "../../services/assets";
import { Block, Note } from "../../types/ucs";
import ChartIndicatorMenu from "../menu/ChartIndicatorMenu";
import BorderLine from "./BorderLine";
import ChartIndicator from "./ChartIndicator";
import ChartSelector from "./ChartSelector";
import ChartVertical from "./ChartVertical";

function Chart() {
  const {
    blocks,
    chartIndicatorMenuPosition,
    setChartIndicatorMenuPosition,
    holdSetter,
    setHoldSetter,
    resetHoldSetter,
    indicator,
    setIndicator,
    resetIndicator,
    isPlaying,
    setIsProtected,
    notes,
    setNotes,
    noteSize,
    resetRedoSnapshots,
    selector,
    setSelector,
    hideSelector,
    pushUndoSnapshot,
    zoom,
  } = useStore();

  const verticalBorderSize = useVerticalBorderSize();

  // Calculate distances (px) of y-coordinate between NavigationBar and each chart block
  const blockYDists: number[] = useMemo(
    () =>
      [...Array(blocks.length)].reduce(
        (prev: number[], _, blockIdx: number) =>
          blockIdx === 0
            ? [0]
            : [
                ...prev,
                prev[blockIdx - 1] +
                  (2.0 *
                    noteSize *
                    ZOOM_VALUES[zoom.idx] *
                    blocks[blockIdx - 1].rows) /
                    blocks[blockIdx - 1].split,
              ],
        []
      ),
    [blocks, noteSize, zoom.idx]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, column: number) => {
      // NOP if ChartIndicatorMenu is visible or the chart is playing
      if (!!chartIndicatorMenuPosition || isPlaying) return;

      // Get mouse hover y-coordinate
      const y: number = Math.floor(
        event.clientY - event.currentTarget.getBoundingClientRect().top
      );

      // Get top, row index in the entire chart, and chart block index at the mouse hover location
      // Set the first two to null if mouse hover is out of the chart block
      let top: number | null = null;
      let rowIdx: number | null = null;
      const blockIdx: number = blocks.findIndex((block: Block, idx: number) => {
        // Height (px) per row of chart block
        const unitRowHeight: number =
          (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;
        // Height (px) of chart block
        const blockHeight: number = unitRowHeight * block.rows;
        if (y < blockYDists[idx] + blockHeight) {
          top = y - ((y - blockYDists[idx]) % unitRowHeight);
          // (top - blockYDists[idx]) is a multiple of unitRowHeight, so ((top - blockYDists[idx]) / unitRowHeight) is theoretically an integer
          // Run Math.round to remove division rounding error and ensure calculation as an integer
          rowIdx =
            block.accumulatedRows +
            Math.round((top - blockYDists[idx]) / unitRowHeight);
          return true;
        }
        return false;
      });

      // Do not update indicator state if column index and row index in the entire chart at the mouse hover location
      // are all the same as the current indicator values, to avoid unnecessary re-rendering
      if (
        (indicator !== null || (top !== null && rowIdx !== null)) &&
        (indicator === null ||
          top === null ||
          rowIdx === null ||
          indicator.column !== column ||
          indicator.rowIdx !== rowIdx)
      ) {
        if (top !== null && rowIdx !== null) {
          setIndicator({
            blockAccumulatedRows: blocks[blockIdx].accumulatedRows,
            blockIdx,
            column,
            rowIdx,
            top,
          });
        } else {
          resetIndicator();
        }
      }

      if (
        selector.setting !== null &&
        (column !== selector.setting.mouseUpColumn ||
          rowIdx !== selector.setting.mouseUpRowIdx)
      ) {
        // Update only coordinates during input of the selection area
        setSelector({
          completed: null,
          isSettingByMenu: selector.isSettingByMenu,
          setting: {
            ...selector.setting,
            mouseUpColumn: column,
            mouseUpRowIdx: rowIdx,
          },
        });
      } else if (
        !event.shiftKey &&
        selector.setting !== null &&
        !selector.isSettingByMenu
      ) {
        // Hide selection area if Shift is not inputted and it is displayed during input without selecting "Start Selecting"
        hideSelector();
      }
    },
    [
      blocks,
      blockYDists,
      chartIndicatorMenuPosition,
      indicator,
      setIndicator,
      resetIndicator,
      isPlaying,
      noteSize,
      selector.setting,
      selector.isSettingByMenu,
      setSelector,
      hideSelector,
      zoom.idx,
    ]
  );

  const onMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // NOP if ChartIndicatorMenu is visible or the chart is playing
      if (!!chartIndicatorMenuPosition || isPlaying) return;

      // Hide indicator
      resetIndicator();

      // Update only coordinates during input of the selection area
      // However, hide selection area if Shift is not inputted and it is displayed during input without selecting "Start Selecting"
      if (selector.setting !== null) {
        setSelector({
          completed: null,
          isSettingByMenu:
            !event.shiftKey && !selector.isSettingByMenu
              ? false
              : selector.isSettingByMenu,
          setting:
            !event.shiftKey && !selector.isSettingByMenu
              ? null
              : {
                  ...selector.setting,
                  mouseUpColumn: null,
                  mouseUpRowIdx: null,
                },
        });
      }
    },
    [
      chartIndicatorMenuPosition,
      isPlaying,
      selector.setting,
      selector.isSettingByMenu,
      resetIndicator,
      setSelector,
    ]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // NOP if not left click, ChartIndicatorMenu is visible, the chart is playing, or indicator is hidden when pressing
      if (
        event.button !== 0 ||
        !!chartIndicatorMenuPosition ||
        isPlaying ||
        indicator === null
      )
        return;

      // Update display parameter when setting a hold only if Shift is not inputted
      if (!event.shiftKey && holdSetter === null) {
        setHoldSetter({
          column: indicator.column,
          isSettingByMenu: false,
          rowIdx: indicator.rowIdx,
          top: indicator.top,
        });
      }

      if (event.shiftKey && selector.setting === null) {
        // Set only coordinates during input of the selection area if Shift is inputted and not inputting the selection area
        setSelector({
          completed: null,
          isSettingByMenu: false,
          setting: {
            mouseDownColumn: indicator.column,
            mouseDownRowIdx: indicator.rowIdx,
            mouseUpColumn: indicator.column,
            mouseUpRowIdx: indicator.rowIdx,
          },
        });
      } else if (
        !event.shiftKey &&
        ((selector.setting !== null && !selector.isSettingByMenu) ||
          selector.completed !== null)
      ) {
        // Hide selection area if Shift is not inputted and it is displayed without selecting "Start Selecting"
        hideSelector();
      }
    },
    [
      chartIndicatorMenuPosition,
      holdSetter,
      indicator,
      isPlaying,
      selector,
      setHoldSetter,
      setSelector,
      hideSelector,
    ]
  );

  const onMouseUp = useCallback(
    (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      // NOP if not left click, ChartIndicatorMenu is visible, the chart is playing, or mouse operation crosses different columns
      if (event.button !== 0 || !!chartIndicatorMenuPosition || isPlaying)
        return;

      // Do not propagate to onMouseUp set in parent WorkSpace component
      event.stopPropagation();

      // Add or delete single note/hold only when clicking in the same column and not inputting the selection area
      if (
        indicator !== null &&
        holdSetter !== null &&
        indicator.column === holdSetter.column &&
        selector.setting === null
      ) {
        // Get row index in the entire chart for start and goal of a single note/hold
        const start: number = Math.min(indicator.rowIdx, holdSetter.rowIdx);
        const goal: number = Math.max(indicator.rowIdx, holdSetter.rowIdx);

        // After mouse down at row index in the entire chart mouseDown.rowIdx
        // and mouse up at row index in the entire chart indicator.rowIdx,
        // add or delete single note/hold at column index indicator.column
        let updatedNotes: Note[];
        if (start === goal) {
          const foundNote: Note | undefined = notes[indicator.column].find(
            (note: Note) => note.rowIdx === start
          );
          if (foundNote && foundNote.type === "X") {
            // Delete existing single note at start without adding a new single note
            updatedNotes = notes[indicator.column].filter(
              (note: Note) => note.rowIdx !== start
            );
          } else if (foundNote) {
            // Delete hold (M/H/W) including start without adding a new single note
            let beforeNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            );
            const foundBeforeNote: Note | undefined = [...beforeNotes]
              .reverse()
              .find((note: Note) => ["X", "M", "W"].includes(note.type));
            if (foundBeforeNote) {
              beforeNotes = beforeNotes.filter((note: Note) =>
                foundBeforeNote.type === "M"
                  ? note.rowIdx < foundBeforeNote.rowIdx
                  : note.rowIdx <= foundBeforeNote.rowIdx
              );
            }

            let afterNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx > start
            );
            const foundAfterNote: Note | undefined = afterNotes.find(
              (note: Note) => ["X", "M", "W"].includes(note.type)
            );
            if (foundAfterNote) {
              afterNotes = afterNotes.filter((note: Note) =>
                foundAfterNote.type === "W"
                  ? note.rowIdx > foundAfterNote.rowIdx
                  : note.rowIdx >= foundAfterNote.rowIdx
              );
            }

            updatedNotes = [...beforeNotes, ...afterNotes];
          } else {
            // Add a new single note at start
            updatedNotes = [
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx < start
              ),
              { rowIdx: start, type: "X" },
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx > start
              ),
            ];
          }
        } else {
          const hold: Note[] = Array.from<unknown, Note>(
            { length: goal - start + 1 },
            (_, idx: number) => {
              return {
                rowIdx: start + idx,
                type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
              };
            }
          );

          if (
            notes[indicator.column].filter(
              (note: Note) => note.rowIdx >= start && note.rowIdx <= goal
            ).length > 0
          ) {
            // Delete hold (M/H/W) between start and goal,
            // then add a new hold between start and goal
            let beforeNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            );
            const foundBeforeNote: Note | undefined = [...beforeNotes]
              .reverse()
              .find((note: Note) => ["X", "M", "W"].includes(note.type));
            if (foundBeforeNote) {
              beforeNotes = beforeNotes.filter((note: Note) =>
                foundBeforeNote.type === "M"
                  ? note.rowIdx < foundBeforeNote.rowIdx
                  : note.rowIdx <= foundBeforeNote.rowIdx
              );
            }

            let afterNotes: Note[] = notes[indicator.column].filter(
              (note: Note) => note.rowIdx > goal
            );
            const foundAfterNote: Note | undefined = afterNotes.find(
              (note: Note) => ["X", "M", "W"].includes(note.type)
            );
            if (foundAfterNote) {
              afterNotes = afterNotes.filter((note: Note) =>
                foundAfterNote.type === "W"
                  ? note.rowIdx > foundAfterNote.rowIdx
                  : note.rowIdx >= foundAfterNote.rowIdx
              );
            }

            updatedNotes = [...beforeNotes, ...hold, ...afterNotes];
          } else {
            // Add a new hold between start and goal
            updatedNotes = [
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx < start
              ),
              ...hold,
              ...notes[indicator.column].filter(
                (note: Note) => note.rowIdx > goal
              ),
            ];
          }
        }

        // Update undo/redo snapshots
        pushUndoSnapshot({ blocks: null, notes });
        resetRedoSnapshots();

        setIsProtected(true);

        // Update notes after adding or deleting single note/hold
        setNotes(
          notes.map((notes: Note[], column: number) =>
            column === indicator.column ? updatedNotes : notes
          )
        );
      }

      // Reset display parameter when setting a hold
      if (holdSetter !== null) {
        resetHoldSetter();
      }

      if (selector.setting !== null) {
        // Update selection area from during input to after input when inputting the selection area
        // However, set to null if mouse coordinate is out of the chart during input of the selection area
        if (
          selector.setting.mouseUpColumn !== null &&
          selector.setting.mouseUpRowIdx !== null
        ) {
          setSelector({
            completed: {
              goalColumn: Math.max(
                selector.setting.mouseDownColumn,
                selector.setting.mouseUpColumn
              ),
              goalRowIdx: Math.max(
                selector.setting.mouseDownRowIdx,
                selector.setting.mouseUpRowIdx
              ),
              startColumn: Math.min(
                selector.setting.mouseDownColumn,
                selector.setting.mouseUpColumn
              ),
              startRowIdx: Math.min(
                selector.setting.mouseDownRowIdx,
                selector.setting.mouseUpRowIdx
              ),
            },
            isSettingByMenu: false,
            setting: null,
          });
        } else {
          hideSelector();
        }
      }
    },
    [
      chartIndicatorMenuPosition,
      holdSetter,
      indicator,
      isPlaying,
      notes,
      selector.setting,
      resetHoldSetter,
      setIsProtected,
      setNotes,
      resetRedoSnapshots,
      setSelector,
      hideSelector,
      pushUndoSnapshot,
    ]
  );

  return (
    <>
      {[...Array(notes.length)].map((_, column: number) => (
        <div key={column} style={{ display: "flex" }}>
          {column === 0 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
          <div
            onContextMenu={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => {
              event.preventDefault();
              if (!isPlaying) {
                setChartIndicatorMenuPosition({
                  top: event.clientY,
                  left: event.clientX,
                });
              }
            }}
            onMouseMove={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => handleMouseMove(event, column)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={{ display: "flex" }}
          >
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: `${noteSize - verticalBorderSize}px`,
              }}
            >
              <ChartVertical
                blockYDists={blockYDists}
                column={column}
                notes={notes[column]}
              />
            </div>
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          </div>
          {column === notes.length - 1 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
        </div>
      ))}
      <ChartIndicator />
      <ChartIndicatorMenu />
      <ChartSelector />
    </>
  );
}

export default Chart;
