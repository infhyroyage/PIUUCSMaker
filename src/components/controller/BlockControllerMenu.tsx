import { memo, useCallback } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState } from "recoil";
import { blockControllerMenuPositionState } from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import { MenuPosition } from "../../types/controller";

function BlockControllerMenu({ blockNum, handler }: BlockControllerMenuProps) {
  const [menuPosition, setMenuPosition] = useRecoilState<MenuPosition>(
    blockControllerMenuPositionState
  );

  const onCloseMenu = useCallback(
    () => setMenuPosition(undefined),
    [setMenuPosition]
  );

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition && menuPosition.position}
      disableRestoreFocus
      onClose={onCloseMenu}
      open={!!menuPosition}
    >
      <MenuList dense>
        <MenuItem
          onClick={() => {
            if (menuPosition) {
              handler.edit(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Resize</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Adjust Beat/Split</MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            if (menuPosition) {
              handler.add(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Add at Bottom
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuPosition) {
              handler.insert(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Insert into Next
        </MenuItem>
        <MenuItem
          disabled={menuPosition && menuPosition.blockIdx === 0}
          onClick={() => {
            if (menuPosition) {
              handler.mergeAbove(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={menuPosition && menuPosition.blockIdx === blockNum - 1}
          onClick={() => {
            if (menuPosition) {
              handler.mergeBelow(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={blockNum < 2}
          onClick={() => {
            if (menuPosition) {
              handler.delete(menuPosition.blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(BlockControllerMenu);
