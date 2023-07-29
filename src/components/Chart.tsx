import { Box, Button } from "@mui/material";
import { useSetRecoilState } from "recoil";
import {
  isShownSystemErrorSnackbarState,
  topBarTitleState,
  userErrorMessageState,
} from "../service/atoms";
import { useState, useTransition } from "react";
import { Block, Chart, Note } from "../types/ucs";

const validateAndLoadUCS = (content: string): Chart => {
  // TODO: UCSファイル解析(ダミーの長時間処理)
  console.log(content);
  const blocks = Array(100)
    .fill("")
    .map<Block>((_, i) => {
      return {
        bpm: i,
        delay: i,
        beat: i,
        split: i,
        length: i,
        notes: Array(1000)
          .fill("")
          .map<Note>((_, j) => {
            return {
              column: j % 10,
              start: j,
              goal: j,
              hollowStarts: [],
              hollowGoals: [],
            };
          }),
      };
    });
  return {
    length: 5,
    isPerformance: true,
    blocks,
  };
};

function Chart() {
  const [chart, setChart] = useState<Chart | undefined>(undefined);
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const [isPending, startTransition] = useTransition();

  const handleUploadUCS = (event: React.ChangeEvent<HTMLInputElement>) => {
    // UCSファイルを何もアップロードしなかった場合はNOP
    const fileList: FileList | null = event.target.files;
    if (!fileList || fileList.length === 0) return;

    // 拡張子チェック
    const splitedName: string[] = fileList[0].name.split(".");
    const extension: string | undefined = splitedName.pop();
    if (extension !== "ucs") {
      setUserErrorMessage("拡張子がucsではありません");
      return;
    }

    const fileName: string = splitedName.join(".");
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      // 内部矛盾チェック
      if (typeof reader.result !== "string") {
        console.error(typeof reader.result);
        setIsShownSystemErrorSnackbar(true);
        return;
      }
      const content: string = reader.result;

      // 譜面以外のDOMを高優先度で再レンダリング
      setTopBarTitle(fileName);

      // 譜面のDOMを低優先度で再レンダリング
      startTransition(() => {
        setChart(validateAndLoadUCS(content));
      });
    };
    reader.readAsText(fileList[0]);
  };

  return chart ? (
    // TODO: 譜面のレンダリング
    chart.blocks.map((block, idx) => (
      <Box key={idx}>{JSON.stringify(block.notes)}</Box>
    ))
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Button variant="contained" component="label" disabled={isPending}>
        {isPending ? "読み込み中..." : "ucsファイルをアップロード"}
        <input
          type="file"
          accept=".ucs"
          style={{ display: "none" }}
          onChange={handleUploadUCS}
        />
      </Button>
    </Box>
  );
}

export default Chart;
