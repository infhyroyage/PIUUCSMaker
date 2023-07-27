import React from "react";
import { Button } from "@mui/material";
import { RecoilRoot } from "recoil";
import { analyzeUCSFile } from "./service/ucs";
import SystemErrorSnackbar from "./components/SystemErrorSnackbar";
import UserErrorSnackbar from "./components/UserErrorSnackbar";

function App() {
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

  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
}

export default App;
