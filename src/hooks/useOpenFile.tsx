import { useTransition } from "react";
import { useSetRecoilState } from "recoil";
import { Block, Chart } from "../types/ucs";
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
  let rowNum: number = 0;
  let line: string | undefined = "";

  // 1行目のチェック
  rowNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${rowNum}行目以降が記載されていません`;
  } else if (line !== ":Format=1") {
    return `ucsファイルの${rowNum}行目が不正です`;
  }

  // 譜面形式(2行目)のチェック・取得
  rowNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${rowNum}行目以降が記載されていません`;
  } else if (
    ![
      ":Mode=Single",
      ":Mode=Double",
      ":Mode=S-Performance",
      ":Mode=D-Performance",
    ].includes(line)
  ) {
    return `ucsファイルの${rowNum}行目が不正です`;
  }
  const chart: Chart = {
    length: [":Mode=Single", ":Mode=S-Performance"].includes(line) ? 5 : 10,
    isPerformance: [":Mode=S-Performance", ":Mode=D-Performance"].includes(
      line
    ),
    blocks: [],
    notes: [],
  };

  // 解析中の譜面のブロックの初期化
  let currentBlock: Block | undefined = undefined;
  // 譜面のブロックの行インデックスの総和の初期化
  let accumulatedRow: number = 0;
  let oldAccumulatedRow: number = 0;
  // 各列の以下の一時変数を初期化
  // * ホールドの始点の行インデックス
  // * 中抜きホールドの中間にかぶせる始点の一時情報
  // * 中抜きホールドの中間にかぶせる始点の行インデックスの配列
  // * 中抜きホールドの中間にかぶせる終点の行インデックスの配列
  let startHolds: number[] = Array(chart.length).fill(0);
  let startHollows: number[] = Array(chart.length).fill(0);
  let hollowStartLists: number[][] = Array(chart.length).fill([]);
  let hollowGoalLists: number[][] = Array(chart.length).fill([]);

  // 2行しか記載していないかのチェック
  rowNum++;
  line = lines.shift();
  if (!line) {
    return `ucsファイルの${rowNum}行目以降が記載されていません`;
  }

  while (!!line) {
    // 改行のみではないかのチェック
    if (line.length === 0) {
      return `ucsファイルの${rowNum}行目が不正です`;
    }

    // 譜面のブロックのヘッダー部のチェック・取得
    if (line[0] === ":") {
      // 2個目以降の譜面のブロックのヘッダーに到達した場合、前の譜面のブロックの行数が0になっていないかどうかチェック
      if (accumulatedRow > 0 && accumulatedRow - oldAccumulatedRow == 0) {
        return `ucsファイルの${rowNum}行目が不正です`;
      }

      // 譜面のブロックの行数を更新して格納
      if (!!currentBlock) {
        currentBlock.length = accumulatedRow - oldAccumulatedRow;
        oldAccumulatedRow = accumulatedRow;
        chart.blocks.push(currentBlock);
      }

      // 譜面のブロックのBPM値のチェック・取得
      if (line.substring(0, 5) !== ":BPM=") {
        return `ucsファイルの${rowNum}行目が不正です`;
      }
      const bpm: number = Number(line.substring(5));
      if (Number.isNaN(bpm)) {
        return `ucsファイルの${rowNum}行目が不正です`;
      }

      // 譜面のブロックのDelay値のチェック・取得
      rowNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${rowNum}行目以降が記載されていません`;
      } else if (line.substring(0, 7) !== ":Delay=") {
        return `ucsファイルの${rowNum}行目が不正です`;
      }
      const delay: number = Number(line.substring(7));
      if (Number.isNaN(delay)) {
        return `ucsファイルの${rowNum}行目が不正です`;
      }

      // 譜面のブロックのBeat値のチェック・取得
      rowNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${rowNum}行目以降が記載されていません`;
      } else if (line.substring(0, 6) !== ":Beat=") {
        return `ucsファイルの${rowNum}行目が不正です`;
      }
      const beat: number = Number(line.substring(6));
      if (Number.isNaN(beat)) {
        return `ucsファイルの${rowNum}行目が不正です`;
      }

      // 譜面のブロックのSplit値のチェック・取得
      rowNum++;
      line = lines.shift();
      if (!line) {
        return `ucsファイルの${rowNum}行目以降が記載されていません`;
      } else if (line.substring(0, 7) !== ":Split=") {
        return `ucsファイルの${rowNum}行目が不正です`;
      }
      const split: number = Number(line.substring(7));
      if (Number.isNaN(split)) {
        return `ucsファイルの${rowNum}行目が不正です`;
      }

      // 譜面のブロック追加
      currentBlock = { bpm, delay, beat, split, length: rowNum };

      rowNum++;
      line = lines.shift();
      continue;
    }

    // 譜面のブロックのヘッダー部以外の列数をチェック
    if (line.length !== chart.length) {
      return `ucsファイルの${rowNum}行目が不正です`;
    }

    // 単ノート/(中抜き)ホールドの情報を解析し、そのインスタンスを追加
    accumulatedRow++;
    for (let column: number = 0; column < chart.length; column++) {
      switch (line[column]) {
        case "X":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] > 0 || startHollows[column] > 0) {
            return `ucsファイルの${rowNum}行目が不正です`;
          }

          // 単ノート追加
          chart.notes.push({
            column,
            start: accumulatedRow,
            goal: accumulatedRow,
            hollowStarts: [],
            hollowGoals: [],
          });

          break;
        case "M":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] > 0 || startHollows[column] > 0) {
            return `ucsファイルの${rowNum}行目が不正です`;
          }

          startHolds[column] = accumulatedRow;
          startHollows[column] = accumulatedRow;

          break;
        case "H":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] == 0) {
            return `ucsファイルの${rowNum}行目が不正です`;
          }

          // 中抜きホールド判定
          if (startHollows[column] == 0) {
            startHollows[column] = accumulatedRow;
          }

          break;
        case "W":
          // 不正なホールドの記述かのチェック
          if (startHolds[column] == 0) {
            return `ucsファイルの${rowNum}行目が不正です`;
          }

          // 中抜きホールド判定
          if (
            hollowStartLists[column].length > 0 &&
            hollowGoalLists[column].length > 0 &&
            startHollows[column] != 0
          ) {
            hollowStartLists[column].push(startHollows[column]);
            hollowGoalLists[column].push(accumulatedRow + 1);
          }

          // ホールド/中抜きホールド追加
          chart.notes.push({
            column,
            start: startHolds[column],
            goal: accumulatedRow,
            hollowStarts: hollowStartLists[column],
            hollowGoals: hollowGoalLists[column],
          });

          startHolds[column] = 0;
          startHollows[column] = 0;
          hollowStartLists[column].length = 0;
          hollowGoalLists[column].length = 0;

          break;
        case ".":
          // 中抜きホールド判定
          if (startHollows[column] > 0) {
            hollowStartLists[column].push(startHollows[column]);
            hollowGoalLists[column].push(accumulatedRow);
            startHollows[column] = 0;
          }

          break;
        default:
          return `ucsファイルの${rowNum}行目が不正です`;
      }
    }

    rowNum++;
    line = lines.shift();
  }

  // 最後のブロックをリストに格納
  if (!currentBlock) {
    return `ucsファイルの${rowNum}行目が不正です`;
  }
  currentBlock.length = accumulatedRow - oldAccumulatedRow;
  chart.blocks.push(currentBlock);

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
