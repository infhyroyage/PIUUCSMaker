import { useTransition } from "react";
import { useSetRecoilState } from "recoil";
import { Block, Chart, Note } from "../types/ucs";
import {
  chartState,
  isShownSystemErrorSnackbarState,
  topBarTitleState,
  userErrorMessageState,
} from "../service/atoms";

const validateAndLoadUCS = (content: string): Chart | string => {
  // ucsファイルの改行コードがCRLF形式かのチェック
  if (content.indexOf("\r\n") === -1) {
    return "改行コードがCRLF形式ではありません";
  }

  const lines: string[] = content.split("\r\n");
  let fileLinesNum: number = 0;
  let line: string | undefined = "";

  // 1行目のチェック
  fileLinesNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
  } else if (line !== ":Format=1") {
    return `ucsファイルの${fileLinesNum}行目が不正です`;
  }

  // 譜面形式(2行目)のチェック・取得
  fileLinesNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
  } else if (
    ![
      ":Mode=Single",
      ":Mode=Double",
      ":Mode=S-Performance",
      ":Mode=D-Performance",
    ].includes(line)
  ) {
    return `ucsファイルの${fileLinesNum}行目が不正です`;
  }
  const chartLength: 5 | 10 = [":Mode=Single", ":Mode=S-Performance"].includes(
    line
  )
    ? 5
    : 10;
  const chart: Chart = {
    length: chartLength,
    isPerformance: [":Mode=S-Performance", ":Mode=D-Performance"].includes(
      line
    ),
    blocks: [],
  };

  /*
   * 各列の以下の一時変数を初期化
   * * 譜面のブロック
   * * 譜面のブロックの行数
   * * 譜面全体での行インデックス
   * * ホールドの始点の行インデックス
   * * 中抜きホールドの中間にかぶせる始点の一時情報
   * * 中抜きホールドの中間にかぶせる始点の行インデックスの配列
   * * 中抜きホールドの中間にかぶせる終点の行インデックスの配列
   */
  let block: Block | undefined = undefined;
  let blockLength: number = 0;
  let rowIdx: number = 0;
  let startHolds: number[] = Array(chartLength).fill(-1);
  let startHollows: number[] = Array(chartLength).fill(-1);
  let hollowStartLists: number[][] = Array(chartLength)
    .fill(null)
    .map<number[]>(() => []);
  let hollowGoalLists: number[][] = Array(chartLength)
    .fill(null)
    .map<number[]>(() => []);

  // 2行しか記載していないかのチェック
  fileLinesNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
  }

  while (!!line) {
    // 改行のみではないかのチェック
    if (line.length === 0) {
      return `ucsファイルの${fileLinesNum}行目が不正です`;
    }

    // 譜面のブロックのヘッダー部のチェック・取得
    if (line[0] === ":") {
      if (!!block) {
        // 直前の譜面のブロックの行数が0になっていないかどうかチェック
        if (blockLength === 0) {
          return `ucsファイルの${fileLinesNum}行目が不正です`;
        }

        // 譜面のブロックの行数を更新して格納
        block.length = blockLength;
        chart.blocks.push(block);
        blockLength = 0;
      }

      // 譜面のブロックのBPM値のチェック・取得
      if (line.substring(0, 5) !== ":BPM=") {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
      const bpm: number = Number(line.substring(5));
      if (Number.isNaN(bpm)) {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }

      // 譜面のブロックのDelay値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
      } else if (line.substring(0, 7) !== ":Delay=") {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
      const delay: number = Number(line.substring(7));
      if (Number.isNaN(delay)) {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }

      // 譜面のブロックのBeat値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
      } else if (line.substring(0, 6) !== ":Beat=") {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
      const beat: number = Number(line.substring(6));
      if (Number.isNaN(beat)) {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }

      // 譜面のブロックのSplit値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${fileLinesNum}行目以降が記載されていません`;
      } else if (line.substring(0, 7) !== ":Split=") {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
      const split: number = Number(line.substring(7));
      if (Number.isNaN(split)) {
        return `ucsファイルの${fileLinesNum}行目が不正です`;
      }

      // 新たな譜面のブロックの解析開始
      block = {
        bpm,
        delay,
        beat,
        split,
        length: 0,
        notes: Array(chartLength)
          .fill(null)
          .map<Note[]>(() => []),
      };

      fileLinesNum++;
      line = lines.shift();
      continue;
    }

    // 1個目の譜面のブロックのヘッダー部のチェック
    if (!block) {
      return `ucsファイルの${fileLinesNum}行目が不正です`;
    }

    // 譜面のブロックのヘッダー部以外の列数をチェック
    if (line.length !== chartLength) {
      return `ucsファイルの${fileLinesNum}行目が不正です`;
    }

    // 単ノート/ホールド/中抜きホールドの情報を解析し、そのインスタンスを追加
    for (let column: number = 0; column < chartLength; column++) {
      switch (line[column]) {
        case "X":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] > -1 || startHollows[column] > -1) {
            return `ucsファイルの${fileLinesNum}行目が不正です`;
          }

          // 単ノート追加
          block.notes[column].push({
            start: rowIdx,
            goal: rowIdx,
            hollowStarts: [],
            hollowGoals: [],
          });

          break;
        case "M":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] > -1 || startHollows[column] > -1) {
            return `ucsファイルの${fileLinesNum}行目が不正です`;
          }

          startHolds[column] = rowIdx;
          startHollows[column] = rowIdx;

          break;
        case "H":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] === -1) {
            return `ucsファイルの${fileLinesNum}行目が不正です`;
          }

          // 中抜きホールド判定
          if (startHollows[column] === -1) {
            startHollows[column] = rowIdx;
          }

          break;
        case "W":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] === -1) {
            return `ucsファイルの${fileLinesNum}行目が不正です`;
          }

          // 中抜きホールド判定
          if (
            hollowStartLists[column].length > 0 &&
            hollowGoalLists[column].length > 0 &&
            startHollows[column] !== -1
          ) {
            hollowStartLists[column].push(startHollows[column]);
            hollowGoalLists[column].push(rowIdx);
          }

          // ホールド/中抜きホールド追加
          block.notes[column].push({
            start: startHolds[column],
            goal: rowIdx,
            hollowStarts: hollowStartLists[column],
            hollowGoals: hollowGoalLists[column],
          });

          startHolds[column] = -1;
          startHollows[column] = -1;
          hollowStartLists[column].length = 0;
          hollowGoalLists[column].length = 0;

          break;
        case ".":
          // 中抜きホールド判定
          if (startHollows[column] > -1) {
            hollowStartLists[column].push(startHollows[column]);
            hollowGoalLists[column].push(rowIdx - 1);
            startHollows[column] = -1;
          }

          break;
        default:
          return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
    }

    fileLinesNum++;
    blockLength++;
    rowIdx++;
    line = lines.shift();
  }

  // 最後のブロックをリストに格納
  if (!block) {
    return `ucsファイルの${fileLinesNum}行目が不正です`;
  }
  block.length = blockLength;
  chart.blocks.push(block);

  return chart;
};

function useOpenFile() {
  const setTopBarTitle = useSetRecoilState<string>(topBarTitleState);
  const setChart = useSetRecoilState<Chart | undefined>(chartState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);
  const setIsShownSystemErrorSnackbar = useSetRecoilState<boolean>(
    isShownSystemErrorSnackbarState
  );

  const [isPending, startTransition] = useTransition();

  const handleOpenFile = (event: React.ChangeEvent<HTMLInputElement>) => {
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

      startTransition(() => {
        const result: Chart | string = validateAndLoadUCS(content);
        if (typeof result === "string") {
          setUserErrorMessage(result);
        } else {
          setTopBarTitle(fileName);
          setChart(result);
        }
      });
    };
    reader.readAsText(fileList[0]);
  };

  return { isOpeningFile: isPending, handleOpenFile };
}

export default useOpenFile;