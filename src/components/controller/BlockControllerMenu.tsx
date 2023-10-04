import { memo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  blockControllerMenuIdxState,
  blockControllerMenuPositionState,
} from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import { BlockControllerMenuPosition } from "../../types/ui";

function BlockControllerMenu({ blockNum, handler }: BlockControllerMenuProps) {
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );
  const blockIdx = useRecoilValue<number>(blockControllerMenuIdxState);

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
            handler.edit(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => alert("TODO")}>
          Adjust Split&Rows fixed BPM
        </MenuItem>
        <MenuItem onClick={() => alert("TODO")}>
          Adjust Split&BPM fixed Rows
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handler.add(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Add at Bottom
        </MenuItem>
        <MenuItem
          onClick={() => {
            handler.insert(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Insert into Next
        </MenuItem>
        <MenuItem
          disabled={blockIdx === 0}
          onClick={() => {
            handler.mergeAbove(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={blockIdx === blockNum - 1}
          onClick={() => {
            handler.mergeBelow(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={blockNum < 2}
          onClick={() => {
            handler.delete(blockIdx);
            setMenuPosition(undefined);
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(BlockControllerMenu);
