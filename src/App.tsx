import React from "react";
import { Typography, Button } from "@mui/material";
import { analyzeUCSFile } from "./service/ucs";

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
    <>
      <Typography variant="h5" gutterBottom>
        ファイルアップロード
      </Typography>
      <Button variant="contained" component="label">
        ucsファイルを選択
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={handleUploadUCS}
        />
      </Button>
    </>
  );
}

export default App;
