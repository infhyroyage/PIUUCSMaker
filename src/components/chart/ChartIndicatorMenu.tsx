import { useCallback } from "react";
import {
  Divider,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { chartIndicatorMenuPositionState } from "../../service/atoms";

function ChartIndicatorMenu() {
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
    >
      <MenuList>
        <MenuItem onClick={() => alert("TODO")}>Cut</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Copy</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Paste</MenuItem>
      </MenuList>
      <Divider />
      <MenuList>
        <MenuItem onClick={() => alert("TODO")}>Flip Horizontal</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Flip Vertical</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Mirror</MenuItem>
      </MenuList>
      <Divider />
      <MenuList>
        <MenuItem onClick={() => alert("TODO")}>Split Block</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default ChartIndicatorMenu;
