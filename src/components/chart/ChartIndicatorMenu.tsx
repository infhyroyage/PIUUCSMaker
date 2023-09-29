import { memo, useCallback } from "react";
import {
  Divider,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { chartIndicatorMenuPositionState } from "../../service/atoms";
import { ChartIndicatorMenuProps } from "../../types/props";

function ChartIndicatorMenu({ handler, indicator }: ChartIndicatorMenuProps) {
  const [position, setPosition] = useRecoilState<PopoverPosition | undefined>(
    chartIndicatorMenuPositionState
  );

  const onCloseMenu = useCallback(() => setPosition(undefined), [setPosition]);

  return (
    <Menu
      anchorReference={position && "anchorPosition"}
      anchorPosition={position}
      disableRestoreFocus
      onClose={onCloseMenu}
      open={!!position}
      slotProps={{
        root: {
          onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            event.stopPropagation(),
        },
      }}
    >
      <MenuList dense>
        <MenuItem onClick={() => alert("TODO")}>Cut</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Copy</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Paste</MenuItem>
        <Divider />
        <MenuItem onClick={() => alert("TODO")}>Flip Horizontal</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Flip Vertical</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Mirror</MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator !== null &&
            indicator.rowIdx === indicator.blockAccumulatedLength
          }
          onClick={() => {
            handler.split(indicator);
            setPosition(undefined);
          }}
        >
          Split Block
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(ChartIndicatorMenu);
