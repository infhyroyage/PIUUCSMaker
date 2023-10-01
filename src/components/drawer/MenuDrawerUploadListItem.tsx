import { memo } from "react";
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
import { MenuDrawerUploadListItemProps } from "../../types/props";

function MenuDrawerUploadListItem({
  disabled,
  extension,
  icon,
  id,
  label,
  onChange,
}: MenuDrawerUploadListItemProps) {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return (
    <Tooltip placement="right" title={label}>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component="label"
          disabled={disabled}
          htmlFor={id}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <input
            id={id}
            type="file"
            accept={extension}
            style={{ display: "none" }}
            onChange={onChange}
          />
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

export default memo(MenuDrawerUploadListItem);
