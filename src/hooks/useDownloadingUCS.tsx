import { useCallback, useTransition } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  columnsState,
  isPerformanceState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  ucsNameState,
  undoSnapshotsState,
} from "../service/atoms";
import { Block, Note } from "../types/chart";
import { ChartSnapshot } from "../types/ui";

function useDownloadingUCS() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const columns = useRecoilValue<5 | 10>(columnsState);
  const isPerformance = useRecoilValue<boolean>(isPerformanceState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const ucsName = useRecoilValue<string | null>(ucsNameState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);
  const setUndoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(undoSnapshotsState);

  const [isPending, startTransition] = useTransition();

  const downloadUCS = useCallback(() => {
    // ucsファイル名未設定の場合はNOP(通常は発生し得ない)
    if (ucsName === null) return;

    startTransition(() => {
      // UCSファイルを生成
      let content: string = ":Format=1\r\n";
      if (columns === 5) {
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

      // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点のいずれかが各列に存在する
      // 譜面全体の行のインデックスを取得(重複なし)
      const existedRowIdxes: number[] = [
        ...new Set<number>(
          notes.map((ns: Note[]) => ns.map((note: Note) => note.rowIdx)).flat()
        ),
      ];

      blocks.forEach((block: Block) => {
        // 譜面のブロックの情報を追記
        content += `:BPM=${block.bpm}\r\n`;
        content += `:Delay=${block.delay}\r\n`;
        content += `:Beat=${block.beat}\r\n`;
        content += `:Split=${block.split}\r\n`;

        // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の情報を列数分追記
        [...Array(block.rows)].forEach((_, i: number) => {
          const rowIdx: number = block.accumulatedRows + i;
          if (existedRowIdxes.includes(rowIdx)) {
            // ダウンロード処理時間の短縮のため、譜面全体の行のインデックスrowIdxに
            // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点の情報が存在する場合のみ
            // find関数を実行して、「X」/「M」/「H」/「W」/「.」を追記
            [...Array(columns)].forEach((_, column: number) => {
              const foundNote: Note | undefined = notes[column].find(
                (note: Note) => note.rowIdx === rowIdx
              );
              content += foundNote ? foundNote.type : ".";
            });
          } else {
            // 譜面全体の行のインデックスrowIdxに単ノート/ホールドの始点/ホールドの中間/ホールドの終点
            // の情報が存在しない場合は「.」を追記
            content += [...Array(columns)].map(() => ".").join("");
          }
          content += "\r\n";
        });
      });

      // UCSファイル名を設定してダウンロード
      const element = document.createElement("a");
      element.href = URL.createObjectURL(
        new Blob([content], {
          type: "text/plain;charset=utf-8",
        })
      );
      element.download = ucsName;
      document.body.appendChild(element);
      element.click();

      // 編集中の離脱の抑止を解除
      setIsProtected(false);
    });
  }, [
    blocks,
    columns,
    isPerformance,
    notes,
    setIsProtected,
    setRedoSnapshots,
    setUndoSnapshots,
    startTransition,
    ucsName,
  ]);

  return { isDownloadingUCS: isPending, downloadUCS };
}

export default useDownloadingUCS;
