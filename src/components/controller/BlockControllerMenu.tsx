import { memo } from "react";
import { Divider, Menu, MenuItem, MenuList } from "@mui/material";
import { useRecoilState } from "recoil";
import { blockControllerMenuPositionState } from "../../service/atoms";
import { BlockControllerMenuProps } from "../../types/props";
import { BlockControllerMenuPosition } from "../../types/ui";

function BlockControllerMenu({ blockNum, handler }: BlockControllerMenuProps) {
  const [menuPosition, setMenuPosition] =
    useRecoilState<BlockControllerMenuPosition>(
      blockControllerMenuPositionState
    );

  return (
    <Menu
      anchorReference={menuPosition.position && "anchorPosition"}
      anchorPosition={menuPosition.position}
      disableRestoreFocus
      onClose={() => setMenuPosition({ blockIdx: menuPosition.blockIdx })}
      open={!!menuPosition.position}
    >
      <MenuList dense>
        <MenuItem
          onClick={() => {
            handler.edit(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Resize</MenuItem>
        <MenuItem onClick={() => alert("TODO")}>Adjust Beat/Split</MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handler.add(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Add at Bottom
        </MenuItem>
        <MenuItem
          onClick={() => {
            handler.insert(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Insert into Next
        </MenuItem>
        <MenuItem
          disabled={menuPosition && menuPosition.blockIdx === 0}
          onClick={() => {
            handler.mergeAbove(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Merge with Above
        </MenuItem>
        <MenuItem
          disabled={menuPosition && menuPosition.blockIdx === blockNum - 1}
          onClick={() => {
            handler.mergeBelow(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Merge with Below
        </MenuItem>
        <MenuItem
          disabled={blockNum < 2}
          onClick={() => {
            handler.delete(menuPosition.blockIdx);
            setMenuPosition({ blockIdx: menuPosition.blockIdx });
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(BlockControllerMenu);
