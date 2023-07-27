import { Button } from "@mui/material";

function UploadRequest() {
  const handleUploadUCS = (event: React.ChangeEvent<HTMLInputElement>) => {
    // UCSファイルを何もアップロードしなかった場合はNOP
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const reader: FileReader = new FileReader();
    reader.onload = () => {
      // アップロードしたUCSがstring型だとみなされない場合はアップロードエラー
      if (typeof reader.result === "string") {
        // TODO
        console.log(reader.result);
      } else {
        // TODO
        console.error(typeof reader.result);
      }
    };
    reader.readAsText(fileList[0]);
  };

  return (
    <Button variant="contained" component="label">
      ucsファイルをアップロード
      <input
        type="file"
        accept=".ucs"
        style={{ display: "none" }}
        onChange={handleUploadUCS}
      />
    </Button>
  );
}

export default UploadRequest;
