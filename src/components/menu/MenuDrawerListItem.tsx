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

  return isOpenedMenuDrawer ? (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        disabled={disabled}
        onClick={onClick}
        sx={generateListItemButtonStyle(true)}
      >
        <ListItemIcon sx={generateListItemIconStyle(true)}>{icon}</ListItemIcon>
        <ListItemText primary={label} sx={{ opacity: 1 }} />
      </ListItemButton>
    </ListItem>
  ) : (
    <Tooltip placement="right" title={label}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          disabled={disabled}
          onClick={onClick}
          sx={generateListItemButtonStyle(false)}
        >
          <ListItemIcon sx={generateListItemIconStyle(false)}>
            {icon}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
}

export default memo(MenuDrawerListItem);
