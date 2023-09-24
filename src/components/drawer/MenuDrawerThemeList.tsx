import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { isDarkModeState, isOpenedMenuDrawerState } from "../../service/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  generateListItemButtonStyle,
  generateListItemIconStyle,
} from "../../service/styles";

function MenuDrawerThemeList() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return (
    <List>
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => setIsDarkMode(!isDarkMode)}
          sx={generateListItemButtonStyle(isOpenedMenuDrawer)}
        >
          <ListItemIcon sx={generateListItemIconStyle(isOpenedMenuDrawer)}>
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
