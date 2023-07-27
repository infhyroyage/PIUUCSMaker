import React, { useEffect, useMemo } from "react";
import { Button, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useRecoilState } from "recoil";
import { analyzeUCSFile } from "./service/ucs";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";
import { isDarkModeState } from "./service/atoms";
import TopBar from "./components/TopBar";

function App() {
  const [isDarkMode, setIsDarkMode] = useRecoilState<boolean>(isDarkModeState);

  const handleUploadUCS = (event: React.ChangeEvent<HTMLInputElement>) => {
    // UCSファイルを何もアップロードしなかった場合はNOP
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const reader: FileReader = new FileReader();
    reader.onload = () => {
      // アップロードしたUCSがstring型だとみなされない場合はアップロードエラー
      if (typeof reader.result === "string") {
        analyzeUCSFile(reader.result);
      } else {
        // TODO
        console.error(typeof reader.result);
      }
    };
    reader.readAsText(fileList[0]);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
      }),
    [isDarkMode]
  );

  useEffect(
    () =>
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches),
    [setIsDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Button variant="contained" component="label">
        ucsファイルをアップロード
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={handleUploadUCS}
        />
      </Button>
      <UserErrorSnackbar />
      <SystemErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
