import { useCallback, useState } from "react";
import { UploadingUCSValidation } from "../types/dialog";
import { Block, Note } from "../types/ucs";
import { useStore } from "./useStore";

const validate = (content: string): UploadingUCSValidation => {
  const blocks: Block[] = [];

  // Check whether the UCS file line break code is CRLF
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
  let line: string | undefined;

  // Check line 1
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

  // Check and get the chart format (line 2)
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
   * Initialize the following temporary variables for each column
   * * Chart block
   * * Number of rows in the chart block
   * * Total numbers of rows in each chart block before this one
   * * Row index in the entire chart
   */
  let block: Block | null = null;
  let rows: number = 0;
  let accumulatedRows: number = 0;
  let rowIdx: number = 0;

  // Check whether only two lines are written
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
    // Check and get the chart block header
    if (line[0] === ":") {
      if (block !== null) {
        // Check whether the previous chart block has zero rows
        if (rows === 0) {
          return {
            blocks,
            errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
            isPerformance,
            notes,
          };
        }

        // Update and store the number of rows in the chart block
        block.rows = rows;
        blocks.push(block);
        accumulatedRows += rows;
        rows = 0;
      }

      // Check and get the BPM of this chart block
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

      // Check and get the Delay of this chart block
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

      // Check and get the Beat of this chart block
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

      // Check and get the Split of this chart block
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

      // Start parsing a new chart block
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

    // Check the header of the first chart block
    if (block === null) {
      return {
        blocks,
        errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
        isPerformance,
        notes,
      };
    }

    // Check the number of columns outside the chart block header
    if (line.length !== columns) {
      return {
        blocks,
        errMsg: `Line ${fileLinesNum} of the ucs file is invalid`,
        isPerformance,
        notes,
      };
    }

    // Parse single note or hold information and add its instance
    for (let column: number = 0; column < columns; column++) {
      switch (line[column]) {
        case "X":
          // Add single note
          notes[column].push({ rowIdx, type: "X" });
          break;
        case "M":
          // Add starting point of hold
          notes[column].push({ rowIdx, type: "M" });
          break;
        case "H":
          // Add setting point of hold
          notes[column].push({ rowIdx, type: "H" });
          break;
        case "W":
          // Add end point of hold
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

  // Store the last chart block in the list
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
      // NOP if no UCS file was uploaded
      const fileList: FileList | null = event.target.files;
      if (!fileList || fileList.length === 0) return;

      // Check the extension
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

          // Initialize to allow the same UCS file to be uploaded again
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
    ],
  );

  return { isUploadingUCS, onUploadUCS };
}

export default useUploadingUCS;
