import {
  AppBar,
  Box,
  LinearProgress,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isDarkModeState,
  isShownTopBarProgressState,
  topBarTitleState,
} from "../service/atoms";

function TopBar() {
  const topBarTitle = useRecoilValue<string>(topBarTitleState);
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);
  const isShownProgress = useRecoilValue<boolean>(isShownTopBarProgressState);

  return (
    <>
      <AppBar position="sticky" sx={{ height: "64px" }}>
        <Toolbar sx={{ height: "100%" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {topBarTitle}
          </Typography>
          <Tooltip title={isDarkMode ? "ダーク" : "ライト"}>
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              icon={<LightModeIcon sx={{ color: "white" }} />}
              checkedIcon={<DarkModeIcon sx={{ color: "white" }} />}
              sx={{
                width: 58,
                height: 38,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                  padding: 0,
                  margin: "7px",
                },
                "& .MuiSwitch-track": {
                  borderRadius: 38 / 2,
                },
              }}
            />
          </Tooltip>{" "}
        </Toolbar>
      </AppBar>
      {isShownProgress ? (
        <LinearProgress />
      ) : (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "block",
            height: "4px",
            zIndex: "0",
          }}
        />
      )}
    </>
  );
}

export default TopBar;
