import { useCallback, useState } from "react";
import { UploadingUCSValidation } from "../types/dialog";
import { Block, Note } from "../types/ucs";
import { useStore } from "./useStore";

const validate = (content: string): UploadingUCSValidation => {
  const blocks: Block[] = [];

  // ucsファイルの改行コードがCRLF形式かのチェック
  if (content.indexOf("\r\n") === -1) {
    return {
      blocks,
      errMsg: "Line break code is not CRLF",
      isPerformance: false,
      notes: [],
    };
  }

  const lines: string[] = content.split("\r\n");
  let fileLinesNum: number = 0;
  let line: string | undefined = "";

  // 1行目のチェック
  fileLinesNum++;
  line = lines.shift();
  if (!line) {
    return {
      blocks,
      errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
      isPerformance: false,
      notes: [],
    };
  } else if (line !== ":Format=1") {
    return {
      blocks,
      errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
      isPerformance: false,
      notes: [],
    };
  }

  // 譜面形式(2行目)のチェック・取得
  fileLinesNum++;
  line = lines.shift();
  if (!line) {
    return {
      blocks,
      errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
      isPerformance: false,
      notes: [],
    };
  } else if (
    ![
      ":Mode=Single",
      ":Mode=Double",
      ":Mode=S-Performance",
      ":Mode=D-Performance",
    ].includes(line)
  ) {
    return {
      blocks,
      errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
      isPerformance: false,
      notes: [],
    };
  }

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
    return {
      blocks,
      errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
      isPerformance,
      notes,
    };
  }

  while (line) {
    // 譜面のブロックのヘッダー部のチェック・取得
    if (line[0] === ":") {
      if (block !== null) {
        // 直前の譜面のブロックの行数が0になっていないかどうかチェック
        if (rows === 0) {
          return {
            blocks,
            errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
            isPerformance,
            notes,
          };
        }

        // 譜面のブロックの行数を更新して格納
        block.rows = rows;
        blocks.push(block);
        accumulatedRows += rows;
        rows = 0;
      }

      // 譜面のブロックのBPM値のチェック・取得
      if (line.substring(0, 5) !== ":BPM=") {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }
      const bpm: number = Number(line.substring(5));
      if (Number.isNaN(bpm)) {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }

      // 譜面のブロックのDelay値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return {
          blocks,
          errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
          isPerformance,
          notes,
        };
      } else if (line.substring(0, 7) !== ":Delay=") {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }
      const delay: number = Number(line.substring(7));
      if (Number.isNaN(delay)) {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }

      // 譜面のブロックのBeat値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return {
          blocks,
          errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
          isPerformance,
          notes,
        };
      } else if (line.substring(0, 6) !== ":Beat=") {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }
      const beat: number = Number(line.substring(6));
      if (Number.isNaN(beat)) {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }

      // 譜面のブロックのSplit値のチェック・取得
      fileLinesNum++;
      line = lines.shift();
      if (!line) {
        return {
          blocks,
          errMsg: `Nothing is written after line ${fileLinesNum} of the ucs file`,
          isPerformance,
          notes,
        };
      } else if (line.substring(0, 7) !== ":Split=") {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
      }
      const split: number = Number(line.substring(7));
      if (Number.isNaN(split)) {
        return {
          blocks,
          errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
          isPerformance,
          notes,
        };
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
      return {
        blocks,
        errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
        isPerformance,
        notes,
      };
    }

    // 譜面のブロックのヘッダー部以外の列数をチェック
    if (line.length !== columns) {
      return {
        blocks,
        errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
        isPerformance,
        notes,
      };
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
          return {
            blocks,
            errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
            isPerformance,
            notes,
          };
      }
    }

    fileLinesNum++;
    rows++;
    rowIdx++;
    line = lines.shift();
  }

  // 最後のブロックをリストに格納
  if (block === null) {
    return {
      blocks,
      errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
      isPerformance,
      notes,
    };
  }
  block.rows = rows;
  blocks.push(block);

  return { blocks, errMsg: null, isPerformance, notes };
};

function useUploadingUCS() {
  const {
    setBlocks,
    setIsPerformance,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    setUcsName,
    resetUndoSnapshots,
    setUserErrorMessage,
  } = useStore();
  const [isUploadingUCS, setIsUploadingUCS] = useState<boolean>(false);

  const onUploadUCS = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // UCSファイルを何もアップロードしなかった場合はNOP
      const fileList: FileList | null = event.target.files;
      if (!fileList || fileList.length === 0) return;

      // 拡張子チェック
      if (fileList[0].name.split(".").pop() !== "ucs") {
        setUserErrorMessage("Extension is not ucs");
        return;
      }

      setIsUploadingUCS(true);
      fileList[0]
        .text()
        .then((content: string) => {
          const result: UploadingUCSValidation = validate(content);
          if (result.errMsg === null) {
            setBlocks(result.blocks);
            setIsPerformance(result.isPerformance);
            setIsProtected(false);
            setNotes(result.notes);
            resetRedoSnapshots();
            setUcsName(fileList[0].name);
            resetUndoSnapshots();
          } else {
            setUserErrorMessage(result.errMsg);
          }

          // 同じUCSファイルを再アップロードできるように初期化
          event.target.value = "";
        })
        .finally(() => setIsUploadingUCS(false));
    },
    [
      setBlocks,
      setIsUploadingUCS,
      setUserErrorMessage,
      setIsPerformance,
      setIsProtected,
      setNotes,
      resetRedoSnapshots,
      setUcsName,
      resetUndoSnapshots,
    ]
  );

  return { isUploadingUCS, onUploadUCS };
}

export default useUploadingUCS;
