import { Divider, Drawer, Theme } from "@mui/material";
import {
  isOpenedMenuDrawerState,
  menuBarHeightState,
} from "../../service/atoms";
import { useRecoilValue } from "recoil";
import MenuDrawerUCSList from "./MenuDrawerUCSList";
import MenuDrawerProcessList from "./MenuDrawerProcessList";
import MenuDrawerZoomList from "./MenuDrawerZoomList";
import MenuDrawerPlayingList from "./MenuDrawerPlayingList";
import MenuDrawerThemeList from "./MenuDrawerThemeList";

const OPENED_DRAWER_WIDTH = 200;

function MenuDrawer() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);
  const menuBarHeight = useRecoilValue<number>(menuBarHeightState);

  return (
    <Drawer
      variant="permanent"
      open={isOpenedMenuDrawer}
      PaperProps={{ elevation: 3, sx: { marginTop: `${menuBarHeight}px` } }}
      sx={(theme: Theme) => ({
        width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : menuBarHeight,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: isOpenedMenuDrawer
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflowX: "hidden",
        "& .MuiDrawer-paper": {
          width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : menuBarHeight,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: isOpenedMenuDrawer
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      })}
    >
      <MenuDrawerUCSList />
      <Divider />
      <MenuDrawerProcessList />
      <Divider />
      <MenuDrawerZoomList />
      <Divider />
      <MenuDrawerPlayingList />
      <Divider />
      <MenuDrawerThemeList />
    </Drawer>
  );
}

export default MenuDrawer;
