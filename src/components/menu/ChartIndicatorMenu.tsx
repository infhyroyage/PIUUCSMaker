import { useCallback, useEffect, useMemo } from "react";
import useClipBoard from "../../hooks/useClipBoard";
import useSelectedDeleting from "../../hooks/useSelectedDeleting";
import useSelectedFlipping from "../../hooks/useSelectedFlipping";
import { useStore } from "../../hooks/useStore";
import { MENU_Z_INDEX } from "../../services/styles";
import MenuBackground from "./MenuBackground";
import MenuItem from "./MenuItem";

function ChartIndicatorMenu() {
  const {
    blocks,
    setBlocks,
    chartIndicatorMenuPosition,
    resetChartIndicatorMenuPosition,
    clipBoard,
    holdSetter,
    setHoldSetter,
    indicator,
    setIndicator,
    setIsProtected,
    resetRedoSnapshots,
    selector,
    setSelector,
    pushUndoSnapshot,
  } = useStore();

  const { handleCut, handleCopy, handlePaste } = useClipBoard();
  const { handleFlip } = useSelectedFlipping();
  const { handleDelete } = useSelectedDeleting();

  const onClose = useCallback(
    () => resetChartIndicatorMenuPosition(),
    [resetChartIndicatorMenuPosition]
  );

  const onClickStartSettingHold = useCallback(() => {
    // NOP if the indicator is not displayed or the selection area is displayed
    if (
      indicator === null ||
      selector.setting !== null ||
      selector.completed !== null
    )
      return;

    // Keep the display parameter when setting a hold from the indicator selected by "Start Setting Hold"
    setHoldSetter({
      column: indicator.column,
      isSettingByMenu: true,
      rowIdx: indicator.rowIdx,
      top: indicator.top,
    });

    onClose();
  }, [indicator, onClose, selector.completed, selector.setting, setHoldSetter]);

  const onClickStartSelecting = useCallback(() => {
    // NOP if the indicator is not displayed or setting a hold
    if (indicator === null || holdSetter !== null) return;

    // Display the selection area from the indicator selected by "Start Selecting"
    setSelector({
      completed: null,
      isSettingByMenu: true,
      setting: {
        mouseDownColumn: indicator.column,
        mouseDownRowIdx: indicator.rowIdx,
        mouseUpColumn: indicator.column,
        mouseUpRowIdx: indicator.rowIdx,
      },
    });

    onClose();
  }, [holdSetter, indicator, onClose, setSelector]);

  const onClickSplitBlock = useCallback(() => {
    // NOP if the indicator is not displayed or indicates the first row of the chart block
    if (
      indicator === null ||
      (indicator !== null &&
        indicator.rowIdx === indicator.blockAccumulatedRows)
    )
      return;

    // Update undo/redo snapshots
    pushUndoSnapshot({ blocks, notes: null });
    resetRedoSnapshots();

    setIsProtected(true);

    // Split the chart block at blockIdx into before rowIdx and from rowIdx
    setBlocks([
      ...blocks.slice(0, indicator.blockIdx),
      {
        ...blocks[indicator.blockIdx],
        rows: indicator.rowIdx - indicator.blockAccumulatedRows,
      },
      {
        ...blocks[indicator.blockIdx],
        accumulatedRows: indicator.rowIdx,
        rows:
          blocks[indicator.blockIdx].rows +
          indicator.blockAccumulatedRows -
          indicator.rowIdx,
      },
      ...blocks.slice(indicator.blockIdx + 1),
    ]);
    setIndicator({
      ...indicator,
      blockIdx: indicator.blockIdx + 1,
      blockAccumulatedRows: indicator.rowIdx,
    });

    onClose();
  }, [
    blocks,
    indicator,
    onClose,
    setBlocks,
    setIndicator,
    setIsProtected,
    resetRedoSnapshots,
    pushUndoSnapshot,
  ]);

  const onClickCut = useCallback(() => {
    handleCut();
    onClose();
  }, [handleCut, onClose]);

  const onClickCopy = useCallback(() => {
    handleCopy();
    onClose();
  }, [handleCopy, onClose]);

  const onClickPaste = useCallback(() => {
    handlePaste();
    onClose();
  }, [handlePaste, onClose]);

  const onClickFlipHorizontal = useCallback(() => {
    handleFlip(true, false);
    onClose();
  }, [handleFlip, onClose]);

  const onClickFlipVertical = useCallback(() => {
    handleFlip(false, true);
    onClose();
  }, [handleFlip, onClose]);

  const onClickMirror = useCallback(() => {
    handleFlip(true, true);
    onClose();
  }, [handleFlip, onClose]);

  const onClickDelete = useCallback(() => {
    handleDelete();
    onClose();
  }, [handleDelete, onClose]);

  // Set keyboard shortcuts and unregister on unmount
  const isMac: boolean = useMemo(
    () => window.navigator.userAgent.indexOf("Mac") !== -1,
    []
  );
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "c":
          if (isMac ? event.metaKey : event.ctrlKey) {
            handleCopy();
          }
          break;
        case "delete":
          if (!isMac) {
            handleDelete();
          }
          break;
        case "m":
          handleFlip(true, true);
          break;
        case "v":
          if (isMac ? event.metaKey : event.ctrlKey) {
            handlePaste();
          }
          break;
        case "x":
          if (isMac ? event.metaKey : event.ctrlKey) {
            handleCut();
          } else {
            handleFlip(true, false);
          }
          break;
        case "y":
          handleFlip(false, true);
          break;
        case "backspace":
          if (isMac) {
            handleDelete();
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleCut, handleDelete, handleFlip, handlePaste, isMac]);

  // Prevent manual vertical scrolling while displayed
  useEffect(() => {
    document.body.style.overflowY = chartIndicatorMenuPosition
      ? "hidden"
      : "scroll";
  }, [chartIndicatorMenuPosition]);

  return (
    chartIndicatorMenuPosition && (
      <>
        <MenuBackground onClose={onClose} />
        <ul
          className="menu bg-base-200 rounded-box fixed"
          style={{
            top: chartIndicatorMenuPosition.top,
            left: chartIndicatorMenuPosition.left,
            zIndex: MENU_Z_INDEX,
          }}
          onMouseUp={(event: React.MouseEvent<HTMLUListElement, MouseEvent>) =>
            event.stopPropagation()
          }
        >
          <MenuItem
            disabled={
              indicator === null ||
              selector.setting !== null ||
              selector.completed !== null
            }
            label="Start Setting Hold"
            onClick={onClickStartSettingHold}
          />
          <MenuItem
            disabled={indicator === null || holdSetter !== null}
            label="Start Selecting"
            onClick={onClickStartSelecting}
          />
          <div className="divider my-0" />
          <MenuItem
            disabled={
              indicator === null ||
              (indicator !== null &&
                indicator.rowIdx === indicator.blockAccumulatedRows)
            }
            label="Split Block"
            onClick={onClickSplitBlock}
          />
          <div className="divider my-0" />
          <MenuItem
            disabled={selector.completed === null}
            label="Cut"
            keyLabel={`${isMac ? "⌘" : "Ctrl"}+X`}
            onClick={onClickCut}
          />
          <MenuItem
            disabled={selector.completed === null}
            label="Copy"
            keyLabel={`${isMac ? "⌘" : "Ctrl"}+C`}
            onClick={onClickCopy}
          />
          <MenuItem
            disabled={indicator === null || clipBoard === null}
            label="Paste"
            keyLabel={`${isMac ? "⌘" : "Ctrl"}+V`}
            onClick={onClickPaste}
          />
          <div className="divider my-0" />
          <MenuItem
            disabled={selector.completed === null}
            label="Flip Horizontal"
            keyLabel="X"
            onClick={onClickFlipHorizontal}
          />
          <MenuItem
            disabled={selector.completed === null}
            label="Flip Vertical"
            keyLabel="Y"
            onClick={onClickFlipVertical}
          />
          <MenuItem
            disabled={selector.completed === null}
            label="Mirror"
            keyLabel="M"
            onClick={onClickMirror}
          />
          <MenuItem
            disabled={selector.completed === null}
            label="Delete"
            keyLabel={`${isMac ? "⌘+" : ""}delete`}
            onClick={onClickDelete}
          />
        </ul>
      </>
    )
  );
}

export default ChartIndicatorMenu;
