import { useCallback, useTransition } from "react";
import { Block, Note } from "../types/ucs";
import { useStore } from "./useStore";

function useDownloadingUCS() {
  const { blocks, isPerformance, setIsProtected, notes, ucsName } = useStore();

  const [isPending, startTransition] = useTransition();

  const downloadUCS = useCallback(() => {
    // NOP if the UCS file name is not set (normally cannot happen)
    if (ucsName === null) return;

    startTransition(() => {
      // Generate a UCS file
      let content: string = ":Format=1\r\n";
      if (notes.length === 5) {
        if (isPerformance) {
          content += ":Mode=S-Performance\r\n";
        } else {
          content += ":Mode=Single\r\n";
        }
      } else {
        if (isPerformance) {
          content += ":Mode=D-Performance\r\n";
        } else {
          content += ":Mode=Double\r\n";
        }
      }

      // Get row indexes in the entire chart where a single note, starting point of hold,
      // setting point of hold or end point of hold exists in each column (without duplicates)
      const existedRowIdxes: number[] = [
        ...new Set<number>(
          notes.map((ns: Note[]) => ns.map((note: Note) => note.rowIdx)).flat()
        ),
      ];

      blocks.forEach((block: Block) => {
        // Append chart block information
        content += `:BPM=${block.bpm}\r\n`;
        content += `:Delay=${block.delay}\r\n`;
        content += `:Beat=${block.beat}\r\n`;
        content += `:Split=${block.split}\r\n`;

        // Append single note, starting point of hold, setting point of hold or end point of hold information for the number of columns
        [...Array(block.rows)].forEach((_, i: number) => {
          const rowIdx: number = block.accumulatedRows + i;
          if (existedRowIdxes.includes(rowIdx)) {
            // To reduce download processing time, run find only when single note,
            // starting point of hold, setting point of hold or end point of hold information
            // exists at row index in the entire chart rowIdx, then append "X"/"M"/"H"/"W"/"."
            [...Array(notes.length)].forEach((_, column: number) => {
              const foundNote: Note | undefined = notes[column].find(
                (note: Note) => note.rowIdx === rowIdx
              );
              content += foundNote ? foundNote.type : ".";
            });
          } else {
            // Append "." if no single note, starting point of hold,
            // setting point of hold or end point of hold information exists
            // at row index in the entire chart rowIdx
            content += [...Array(notes.length)].map(() => ".").join("");
          }
          content += "\r\n";
        });
      });

      // Set the UCS file name and download
      const element = document.createElement("a");
      element.href = URL.createObjectURL(
        new Blob([content], {
          type: "text/plain;charset=utf-8",
        })
      );
      element.download = ucsName;
      document.body.appendChild(element);
      element.click();

      // Release prevent exit during editing
      setIsProtected(false);
    });
  }, [blocks, isPerformance, notes, setIsProtected, startTransition, ucsName]);

  return { isDownloadingUCS: isPending, downloadUCS };
}

export default useDownloadingUCS;
