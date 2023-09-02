import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import useMenuDrawerStyles from "../hooks/useMenuDrawerStyles";
import { isDarkModeState, isOpenedMenuDrawerState } from "../service/atoms";
import { useRecoilState, useRecoilValue } from "recoil";

function MenuDrawerThemeList() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  const { listItemButtonStyle, listItemIconStyle } = useMenuDrawerStyles();

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => setIsDarkMode(!isDarkMode)}
          sx={listItemButtonStyle}
        >
          <ListItemIcon sx={listItemIconStyle}>
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </ListItemIcon>
          {isOpenedMenuDrawer && (
            <ListItemText
              primary={isDarkMode ? "Dark" : "Light"}
              sx={{ opacity: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </List>
  );
}

export default MenuDrawerThemeList;
