import { Divider, Drawer, Theme } from "@mui/material";
import { isOpenedMenuDrawerState } from "../service/atoms";
import { useRecoilValue } from "recoil";
import MenuDrawerFileList from "./MenuDrawerFileList";
import MenuDrawerProcessList from "./MenuDrawerProcessList";
import MenuDrawerZoomList from "./MenuDrawerZoomList";
import MenuDrawerPlayingList from "./MenuDrawerPlayingList";

const OPENED_DRAWER_WIDTH = 200;

function MenuDrawer() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  return (
    <Drawer
      variant="permanent"
      open={isOpenedMenuDrawer}
      PaperProps={{ elevation: 3, sx: { marginTop: "64px" } }}
      sx={(theme: Theme) => ({
        width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : "64px",
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
          width: isOpenedMenuDrawer ? OPENED_DRAWER_WIDTH : "64px",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: isOpenedMenuDrawer
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
      })}
    >
      <MenuDrawerFileList />
      <Divider />
      <MenuDrawerProcessList />
      <Divider />
      <MenuDrawerZoomList />
      <Divider />
      <MenuDrawerPlayingList />
    </Drawer>
  );
}

export default MenuDrawer;
