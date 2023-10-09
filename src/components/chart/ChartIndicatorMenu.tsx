import { memo } from "react";
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
  Typography,
} from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chartIndicatorMenuPositionState,
  clipBoardState,
  indicatorState,
  selectorState,
} from "../../service/atoms";
import { ChartIndicatorMenuProps } from "../../types/props";
import { Selector } from "../../types/ui";
import { Indicator } from "../../types/ui";
import { ClipBoard } from "../../types/ui";
import useClipBoard from "../../hooks/useClipBoard";
import useSelectedFlipping from "../../hooks/useSelectedFlipping";
import useSelectedDeleting from "../../hooks/useSelectedDeleting";

function ChartIndicatorMenu({ handler }: ChartIndicatorMenuProps) {
  const clipBoard = useRecoilValue<ClipBoard>(clipBoardState);
  const [menuPosition, setMenuPosition] = useRecoilState<
    PopoverPosition | undefined
  >(chartIndicatorMenuPositionState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const selector = useRecoilValue<Selector>(selectorState);

  const { handleCut, handleCopy, handlePaste } = useClipBoard();
  const { handleFlip } = useSelectedFlipping();
  const { handleDelete } = useSelectedDeleting();

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
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleCut();
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+X
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleCopy();
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+C
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={indicator === null || clipBoard === null}
          onClick={() => {
            handlePaste();
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleFlip(true, false);
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Flip Horizontal</ListItemText>
          <Typography variant="body2" color="text.secondary">
            X
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleFlip(false, true);
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Flip Vertical</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Y
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleFlip(true, true);
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Mirror</ListItemText>
          <Typography variant="body2" color="text.secondary">
            M
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => {
            handleDelete();
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Delete
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator !== null &&
            indicator.rowIdx === indicator.blockAccumulatedLength
          }
          onClick={() => {
            handler.split(indicator);
            setMenuPosition(undefined);
          }}
        >
          Split Block
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(ChartIndicatorMenu);
