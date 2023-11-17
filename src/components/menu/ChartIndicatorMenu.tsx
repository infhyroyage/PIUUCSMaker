import { Divider, Menu, MenuList } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartIndicatorMenuPositionState,
  clipBoardState,
  indicatorState,
  holdSetterState,
  selectorState,
  blocksState,
  isProtectedState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../services/atoms";
import { HoldSetter, Selector } from "../../types/chart";
import { Indicator } from "../../types/chart";
import { Block, ChartSnapshot, ClipBoard } from "../../types/ucs";
import useClipBoard from "../../hooks/useClipBoard";
import useSelectedFlipping from "../../hooks/useSelectedFlipping";
import useSelectedDeleting from "../../hooks/useSelectedDeleting";
import { ChartIndicatorMenuPosition } from "../../types/menu";
import { useCallback, useEffect, useMemo } from "react";
import ChartIndicatorMenuItem from "./ChartIndicatorMenuItem";

function ChartIndicatorMenu() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [holdSetter, setHoldSetter] =
    useRecoilState<HoldSetter>(holdSetterState);
  const [indicator, setIndicator] = useRecoilState<Indicator>(indicatorState);
  const [menuPosition, setMenuPosition] =
    useRecoilState<ChartIndicatorMenuPosition>(chartIndicatorMenuPositionState);
  const [selector, setSelector] = useRecoilState<Selector>(selectorState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const clipBoard = useRecoilValue<ClipBoard>(clipBoardState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const { handleCut, handleCopy, handlePaste } = useClipBoard();
  const { handleFlip } = useSelectedFlipping();
  const { handleDelete } = useSelectedDeleting();

  const onClickStartSettingHold = useCallback(() => {
    // インディケーターが非表示/選択領域が表示中の場合はNOP
    if (
      indicator === null ||
      selector.setting !== null ||
      selector.completed !== null
    )
      return;

    // 「Start Setting Hold」を選択したインディケーターの表示パラメーターを用いて、
    // ホールド設置中の表示パラメーターを保持
    setHoldSetter({
      column: indicator.column,
      isSettingByMenu: true,
      rowIdx: indicator.rowIdx,
      top: indicator.top,
    });

    setMenuPosition(undefined);
  }, [
    indicator,
    selector.completed,
    selector.setting,
    setHoldSetter,
    setMenuPosition,
  ]);

  const onClickStartSelecting = useCallback(() => {
    // インディケーターが非表示/ホールド設置中の場合はNOP
    if (indicator === null || holdSetter !== null) return;

    // 「Start Selecting」を選択したインディケーターの表示パラメーターを用いて、選択領域を表示
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

    setMenuPosition(undefined);
  }, [holdSetter, indicator, setMenuPosition, setSelector]);

  const onClickSplitBlock = useCallback(() => {
    // インディケーターが非表示/譜面のブロックの先頭の行にインディケーターが存在する場合はNOP
    if (
      indicator === null ||
      (indicator !== null &&
        indicator.rowIdx === indicator.blockAccumulatedRows)
    )
      return;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
    setRedoSnapshots([]);

    setIsProtected(true);

    // blockIdx番目の譜面のブロックを、(rowIdx- 1)番目以前とrowIdx番目とで分割
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

    setMenuPosition(undefined);
  }, [
    blocks,
    indicator,
    setBlocks,
    setIndicator,
    setIsProtected,
    setMenuPosition,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClickCut = useCallback(() => {
    handleCut();
    setMenuPosition(undefined);
  }, [handleCut, setMenuPosition]);

  const onClickCopy = useCallback(() => {
    handleCopy();
    setMenuPosition(undefined);
  }, [handleCopy, setMenuPosition]);

  const onClickPaste = useCallback(() => {
    handlePaste();
    setMenuPosition(undefined);
  }, [handlePaste, setMenuPosition]);

  const onClickFlipHorizontal = useCallback(() => {
    handleFlip(true, false);
    setMenuPosition(undefined);
  }, [handleFlip, setMenuPosition]);

  const onClickFlipVertical = useCallback(() => {
    handleFlip(false, true);
    setMenuPosition(undefined);
  }, [handleFlip, setMenuPosition]);

  const onClickMirror = useCallback(() => {
    handleFlip(true, true);
    setMenuPosition(undefined);
  }, [handleFlip, setMenuPosition]);

  const onClickDelete = useCallback(() => {
    handleDelete();
    setMenuPosition(undefined);
  }, [handleDelete, setMenuPosition]);

  // キー入力のイベントリスナーを登録し、アンマウント時に解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "c":
          if (event.ctrlKey) {
            handleCopy();
          }
          break;
        case "delete":
          handleDelete();
          break;
        case "m":
          handleFlip(true, true);
          break;
        case "v":
          if (event.ctrlKey) {
            handlePaste();
          }
          break;
        case "x":
          if (event.ctrlKey) {
            handleCut();
          } else {
            handleFlip(true, false);
          }
          break;
        case "y":
          handleFlip(false, true);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleCut, handleDelete, handleFlip, handlePaste]);

  const isDisabledOtherItem = useMemo(
    () => selector.completed === null,
    [selector.completed]
  );

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition}
      disableRestoreFocus
      onClose={() => setMenuPosition(undefined)}
      open={!!menuPosition}
      slotProps={{
        root: {
          onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            event.stopPropagation(),
        },
        paper: { sx: { minWidth: 200 } },
      }}
    >
      <MenuList dense>
        <ChartIndicatorMenuItem
          disabled={
            indicator === null ||
            selector.setting !== null ||
            selector.completed !== null
          }
          label="Start Setting Hold"
          onClick={onClickStartSettingHold}
        />
        <ChartIndicatorMenuItem
          disabled={indicator === null || holdSetter !== null}
          label="Start Selecting"
          onClick={onClickStartSelecting}
        />
        <Divider />
        <ChartIndicatorMenuItem
          disabled={
            indicator === null ||
            (indicator !== null &&
              indicator.rowIdx === indicator.blockAccumulatedRows)
          }
          label="Split Block"
          onClick={onClickSplitBlock}
        />
        <Divider />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Cut"
          keyLabel="Ctrl+X"
          onClick={onClickCut}
        />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Copy"
          keyLabel="Ctrl+C"
          onClick={onClickCopy}
        />
        <ChartIndicatorMenuItem
          disabled={indicator === null || clipBoard === null}
          label="Paste"
          keyLabel="Ctrl+V"
          onClick={onClickPaste}
        />
        <Divider />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Flip Horizontal"
          keyLabel="X"
          onClick={onClickFlipHorizontal}
        />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Flip Vertical"
          keyLabel="Y"
          onClick={onClickFlipVertical}
        />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Mirror"
          keyLabel="M"
          onClick={onClickMirror}
        />
        <ChartIndicatorMenuItem
          disabled={isDisabledOtherItem}
          label="Delete"
          keyLabel="Delete"
          onClick={onClickDelete}
        />
      </MenuList>
    </Menu>
  );
}

export default ChartIndicatorMenu;
