import { useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Block, Note } from "../types/chart";
import {
  blocksState,
  columnsState,
  isPerformanceState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  ucsNameState,
  undoSnapshotsState,
  userErrorMessageState,
} from "../service/atoms";
import { UploadingUCSValidation } from "../types/dialog";
import { ChartSnapshot } from "../types/ui";

const validateAndLoadUCS = (
  content: string
): UploadingUCSValidation | string => {
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

  const blocks: Block[] = [];
  const columns: 5 | 10 = [":Mode=Single", ":Mode=S-Performance"].includes(line)
    ? 5
    : 10;
  const isPerformance: boolean = [
    ":Mode=S-Performance",
    ":Mode=D-Performance",
  ].includes(line);
  const notes: Note[][] = Array(columns)
    .fill(null)
    .map<Note[]>(() => []);

  /*
   * 各列の以下の一時変数を初期化
   * * 譜面のブロック
   * * 譜面のブロックの行数
   * * 以前までの譜面のブロックの行数の総和
   * * 譜面全体での行インデックス
   */
  let block: Block | null = null;
  let rows: number = 0;
  let accumulatedRows: number = 0;
  let rowIdx: number = 0;

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
      if (block !== null) {
        // 直前の譜面のブロックの行数が0になっていないかどうかチェック
        if (rows === 0) {
          return `ucsファイルの${fileLinesNum}行目が不正です`;
        }

        // 譜面のブロックの行数を更新して格納
        block.rows = rows;
        blocks.push(block);
        accumulatedRows += rows;
        rows = 0;
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
        rows: 0,
        accumulatedRows,
      };

      fileLinesNum++;
      line = lines.shift();
      continue;
    }

    // 1個目の譜面のブロックのヘッダー部のチェック
    if (block === null) {
      return `ucsファイルの${fileLinesNum}行目が不正です`;
    }

    // 譜面のブロックのヘッダー部以外の列数をチェック
    if (line.length !== columns) {
      return `ucsファイルの${fileLinesNum}行目が不正です`;
    }

    // 単ノート/ホールドの情報を解析し、そのインスタンスを追加
    for (let column: number = 0; column < columns; column++) {
      switch (line[column]) {
        case "X":
          // 単ノート追加
          notes[column].push({ rowIdx, type: "X" });
          break;
        case "M":
          // ホールドの始点追加
          notes[column].push({ rowIdx, type: "M" });
          break;
        case "H":
          // ホールドの中間追加
          notes[column].push({ rowIdx, type: "H" });
          break;
        case "W":
          // ホールドの終点追加
          notes[column].push({ rowIdx, type: "W" });
          break;
        case ".":
          break;
        default:
          return `ucsファイルの${fileLinesNum}行目が不正です`;
      }
    }

    fileLinesNum++;
    rows++;
    rowIdx++;
    line = lines.shift();
  }

  // 最後のブロックをリストに格納
  if (block === null) {
    return `ucsファイルの${fileLinesNum}行目が不正です`;
  }
  block.rows = rows;
  blocks.push(block);

  return { blocks, columns, isPerformance, notes };
};

function useUploadingUCS() {
  const [isUploadingUCS, setIsUploadingUCS] = useState<boolean>(false);
  const setBlocks = useSetRecoilState<Block[]>(blocksState);
  const setColumns = useSetRecoilState<5 | 10>(columnsState);
  const setIsPerformance = useSetRecoilState<boolean>(isPerformanceState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setNotes = useSetRecoilState<Note[][]>(notesState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const setUcsName = useSetRecoilState<string | null>(ucsNameState);
  const setUndoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setUserErrorMessage = useSetRecoilState<string>(userErrorMessageState);

  const onUploadUCS = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // UCSファイルを何もアップロードしなかった場合はNOP
      const fileList: FileList | null = event.target.files;
      if (!fileList || fileList.length === 0) return;

      // 拡張子チェック
      if (fileList[0].name.split(".").pop() !== "ucs") {
        setUserErrorMessage("拡張子がucsではありません");
        return;
      }

      setIsUploadingUCS(true);
      fileList[0]
        .text()
        .then((content: string) => {
          const result: UploadingUCSValidation | string =
            validateAndLoadUCS(content);
          if (typeof result === "string") {
            setUserErrorMessage(result);
          } else {
            setBlocks(result.blocks);
            setColumns(result.columns);
            setIsPerformance(result.isPerformance);
            setIsProtected(false);
            setNotes(result.notes);
            setRedoSnapshots([]);
            setUcsName(fileList[0].name);
            setUndoSnapshots([]);
          }

          // 同じUCSファイルを再アップロードできるように初期化
          event.target.value = "";
        })
        .finally(() => setIsUploadingUCS(false));
    },
    [
      setBlocks,
      setColumns,
      setIsUploadingUCS,
      setUserErrorMessage,
      setIsPerformance,
      setIsProtected,
      setNotes,
      setRedoSnapshots,
      setUcsName,
      setUndoSnapshots,
    ]
  );

  return { isUploadingUCS, onUploadUCS };
}

export default useUploadingUCS;
