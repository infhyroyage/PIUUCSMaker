import { memo } from "react";
import { MenuDrawerListItemProps } from "../../types/props";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { isOpenedMenuDrawerState } from "../../service/atoms";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../../service/styles";

function MenuDrawerListItem({
  disabled,
  icon,
  label,
  onClick,
}: MenuDrawerListItemProps) {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return (
    <Tooltip placement="right" title={label}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={disabled}
          onClick={onClick}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
            {icon}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText primary={label} sx={{ opacity: 1 }} />
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}

export default memo(MenuDrawerListItem);
