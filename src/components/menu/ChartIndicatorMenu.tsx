import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
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
import { useCallback, useEffect } from "react";

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
        <MenuItem
          disabled={
            indicator === null ||
            selector.setting !== null ||
            selector.completed !== null
          }
          onClick={onClickStartSettingHold}
        >
          Start Setting Hold
        </MenuItem>
        <MenuItem
          disabled={indicator === null || holdSetter !== null}
          onClick={onClickStartSelecting}
        >
          Start Selecting
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator === null ||
            (indicator !== null &&
              indicator.rowIdx === indicator.blockAccumulatedRows)
          }
          onClick={onClickSplitBlock}
        >
          Split Block
        </MenuItem>
        <Divider />
        <MenuItem disabled={selector.completed === null} onClick={onClickCut}>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+X
          </Typography>
        </MenuItem>
        <MenuItem disabled={selector.completed === null} onClick={onClickCopy}>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+C
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={indicator === null || clipBoard === null}
          onClick={onClickPaste}
        >
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={selector.completed === null}
          onClick={onClickFlipHorizontal}
        >
          <ListItemText>Flip Horizontal</ListItemText>
          <Typography variant="body2" color="text.secondary">
            X
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={selector.completed === null}
          onClick={onClickFlipVertical}
        >
          <ListItemText>Flip Vertical</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Y
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={selector.completed === null}
          onClick={onClickMirror}
        >
          <ListItemText>Mirror</ListItemText>
          <Typography variant="body2" color="text.secondary">
            M
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={selector.completed === null}
          onClick={onClickDelete}
        >
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Delete
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default ChartIndicatorMenu;
