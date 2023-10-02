import { memo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  blockControllerMenuIdxState,
  blockControllerMenuPositionState,
} from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import {
  BlockControllerMenuIdx,
  BlockControllerMenuPosition,
} from "../../types/ui";

function BlockControllerMenu({ blockNum, handler }: BlockControllerMenuProps) {
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const blockIdx = useRecoilValue<BlockControllerMenuIdx>(
    blockControllerMenuIdxState
  );

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition}
      disableRestoreFocus
      onClose={() => setMenuPosition(undefined)}
      open={!!menuPosition}
    >
      <MenuList dense>
        <MenuItem
          onClick={() => {
            if (blockIdx) {
              handler.edit(blockIdx);
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
            if (blockIdx) {
              handler.add(blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Add at Bottom
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (blockIdx) {
              handler.insert(blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Insert into Next
        </MenuItem>
        <MenuItem
          disabled={blockIdx === 0}
          onClick={() => {
            if (blockIdx) {
              handler.mergeAbove(blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={blockIdx === blockNum - 1}
          onClick={() => {
            if (blockIdx) {
              handler.mergeBelow(blockIdx);
              setMenuPosition(undefined);
            }
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={blockNum < 2}
          onClick={() => {
            if (blockIdx) {
              handler.delete(blockIdx);
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
