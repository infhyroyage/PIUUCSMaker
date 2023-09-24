import { memo, useCallback } from "react";
import {
  Divider,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
} from "@mui/material";
import { useRecoilState } from "recoil";
import { blockControllerMenuPositionState } from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";

function BlockControllerMenu({
  blockIdx,
  isDisabledDelete,
  handler,
}: BlockControllerMenuProps) {
  const [position, setPosition] = useRecoilState<PopoverPosition | undefined>(
    blockControllerMenuPositionState
  );

  // Menuを非表示
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
        <MenuItem
          onClick={() => {
            handler.edit(blockIdx);
            setPosition(undefined);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Resize</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Adjust Beat/Split</MenuItem>
      </MenuList>
      <Divider />
      <MenuList>
        <MenuItem onClick={() => alert("TODO")}>Add at Bottom</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Insert into Next</MenuItem>
        <MenuItem
          disabled={blockIdx === 0}
          onClick={() => {
            handler.mergeAbove(blockIdx);
            setPosition(undefined);
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={blockIdx === 0}
          onClick={() => {
            handler.mergeBelow(blockIdx);
            setPosition(undefined);
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={isDisabledDelete}
          onClick={() => {
            handler.delete(blockIdx);
            setPosition(undefined);
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(BlockControllerMenu);
