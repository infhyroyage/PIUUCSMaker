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
import { ClipBoard, Indicator, Selector } from "../../types/chart";
import useClipBoard from "../../hooks/useClipBoard";
import useFlipping from "../../hooks/useFlipping";

function ChartIndicatorMenu({ handler }: ChartIndicatorMenuProps) {
  const clipBoard = useRecoilValue<ClipBoard>(clipBoardState);
  const [menuPosition, setMenuPosition] = useRecoilState<
    PopoverPosition | undefined
  >(chartIndicatorMenuPositionState);
  const indicator = useRecoilValue<Indicator>(indicatorState);
  const selector = useRecoilValue<Selector>(selectorState);

  const { handleCut, handleCopy, handlePaste } = useClipBoard();
  const { flip } = useFlipping();

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
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Delete
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
            flip(true, false);
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
            flip(false, true);
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
            flip(true, true);
            setMenuPosition(undefined);
          }}
        >
          <ListItemText>Mirror</ListItemText>
          <Typography variant="body2" color="text.secondary">
            M
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator !== null &&
            (indicator.rowIdx === indicator.blockAccumulatedLength ||
              indicator.mouseDownColumn !== null ||
              indicator.mouseDownRowIdx !== null ||
              indicator.mouseDownTop !== null)
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
