import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../../hooks/useStore";
import { DIALOG_Z_INDEX } from "../../services/styles";
import { roundBpm } from "../../services/validations";
import { AdjustBlockDialogFormFixed } from "../../types/dialog";
import { Block, Note } from "../../types/ucs";

function AdjustBlockDialog() {
  const {
    blockControllerMenuBlockIdx,
    resetBlockControllerMenuBlockIdx,
    adjustBlockDialogForm,
    setAdjustBlockDialogForm,
    resetAdjustBlockDialogForm,
    blocks,
    setBlocks,
    setIsProtected,
    notes,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
  } = useStore();
  const [fixed, setFixed] = useState<AdjustBlockDialogFormFixed>("bpm");

  const menuBlock = useMemo(
    () =>
      blockControllerMenuBlockIdx === null
        ? null
        : blocks[blockControllerMenuBlockIdx],
    [blocks, blockControllerMenuBlockIdx],
  );

  useEffect(
    () =>
      setAdjustBlockDialogForm({
        bpm:
          blockControllerMenuBlockIdx === null
            ? -1
            : blocks[blockControllerMenuBlockIdx].bpm,
        rows:
          blockControllerMenuBlockIdx === null
            ? -1
            : blocks[blockControllerMenuBlockIdx].rows,
        split:
          blockControllerMenuBlockIdx === null
            ? -1
            : blocks[blockControllerMenuBlockIdx].split,
      }),
    [blocks, blockControllerMenuBlockIdx, setAdjustBlockDialogForm],
  );

  const onUpdate = useCallback(() => {
    // BlockControllerMenuのメニューを開いていない場合はNOP
    if (blockControllerMenuBlockIdx === null) return;

    // blockControllerMenuBlockIdx番目の譜面のブロックの行数の差分
    const deltaRows: number =
      Number(adjustBlockDialogForm.rows) -
      blocks[blockControllerMenuBlockIdx].rows;

    // 元に戻す/やり直すスナップショットの集合を更新
    pushUndoSnapshot({ blocks, notes: deltaRows === 0 ? null : notes });
    resetRedoSnapshots();

    // blockControllerMenuBlockIdx番目以降の譜面のブロックをすべて更新
    const updatedBlocks: Block[] = [...Array(blocks.length)].map(
      (_, blockIdx: number) =>
        blockIdx === blockControllerMenuBlockIdx
          ? {
              accumulatedRows:
                blocks[blockControllerMenuBlockIdx].accumulatedRows,
              beat: blocks[blockControllerMenuBlockIdx].beat,
              bpm: roundBpm(adjustBlockDialogForm.bpm),
              delay: blocks[blockControllerMenuBlockIdx].delay,
              rows: adjustBlockDialogForm.rows,
              split: adjustBlockDialogForm.split,
            }
          : blockIdx > blockControllerMenuBlockIdx
            ? {
                ...blocks[blockIdx],
                accumulatedRows:
                  blocks[blockIdx - 1].accumulatedRows +
                  blocks[blockIdx - 1].rows +
                  deltaRows,
              }
            : blocks[blockIdx],
    );

    // 行数を変更した場合のみ、blockControllerMenuBlockIdx番目以降の譜面のブロックに該当する
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
    let updatedNotes: Note[][] = [...notes];
    if (deltaRows !== 0) {
      // 以下の譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
      // * (blockControllerMenuBlockIdx - 1)番目以前: 更新しない
      // * blockControllerMenuBlockIdx番目          : 譜面全体の行インデックスをスケーリング(空白 < X < H < M < W)
      // * (blockControllerMenuBlockIdx + 1)番目以降: 譜面全体の行インデックスを譜面のブロックの行数の差分ズラす
      updatedNotes = [...notes].map((ns: Note[]) => [
        // (blockControllerMenuBlockIdx - 1)番目以前の譜面のブロック
        ...ns.filter(
          (note: Note) =>
            note.rowIdx < blocks[blockControllerMenuBlockIdx].accumulatedRows,
        ),
        // blockControllerMenuBlockIdx番目の譜面のブロック
        ...ns
          .filter(
            (note: Note) =>
              note.rowIdx >=
                blocks[blockControllerMenuBlockIdx].accumulatedRows &&
              note.rowIdx <
                blocks[blockControllerMenuBlockIdx].accumulatedRows +
                  blocks[blockControllerMenuBlockIdx].rows,
          )
          .reduce((prev: Note[], note: Note) => {
            const scaledRowIdx: number =
              blocks[blockControllerMenuBlockIdx].accumulatedRows +
              Math.floor(
                ((note.rowIdx -
                  blocks[blockControllerMenuBlockIdx].accumulatedRows) *
                  Number(adjustBlockDialogForm.rows)) /
                  blocks[blockControllerMenuBlockIdx].rows,
              );
            const prevScaledNote: Note | undefined = prev.find(
              (note: Note) => note.rowIdx === scaledRowIdx,
            );

            return prevScaledNote
              ? [
                  ...prev.slice(0, prev.length - 1),
                  {
                    rowIdx: scaledRowIdx,
                    type:
                      prevScaledNote.type === "X" ||
                      (prevScaledNote.type === "H" &&
                        ["M", "W"].includes(note.type)) ||
                      (prevScaledNote.type === "M" && note.type === "W")
                        ? note.type
                        : prevScaledNote.type,
                  },
                ]
              : [...prev, { rowIdx: scaledRowIdx, type: note.type }];
          }, []),
        // (blockControllerMenuBlockIdx + 1)番目以降の譜面のブロック
        ...ns
          .filter(
            (note: Note) =>
              note.rowIdx >=
              blocks[blockControllerMenuBlockIdx].accumulatedRows +
                blocks[blockControllerMenuBlockIdx].rows,
          )
          .map((note: Note) => {
            return { rowIdx: note.rowIdx + deltaRows, type: note.type };
          }),
      ]);
    }

    setIsProtected(true);

    setBlocks(updatedBlocks);
    if (deltaRows !== 0) setNotes(updatedNotes);

    resetBlockControllerMenuBlockIdx();
    resetAdjustBlockDialogForm();
  }, [
    blocks,
    adjustBlockDialogForm,
    blockControllerMenuBlockIdx,
    notes,
    setBlocks,
    setIsProtected,
    resetBlockControllerMenuBlockIdx,
    setNotes,
    resetRedoSnapshots,
    pushUndoSnapshot,
    resetAdjustBlockDialogForm,
  ]);

  const onClose = useCallback(() => {
    resetBlockControllerMenuBlockIdx();
    resetAdjustBlockDialogForm();
  }, [resetBlockControllerMenuBlockIdx, resetAdjustBlockDialogForm]);

  return (
    blockControllerMenuBlockIdx !== null &&
    menuBlock !== null && (
      <dialog
        id="adjust-block-dialog"
        className="modal"
        style={{ zIndex: DIALOG_Z_INDEX }}
        data-testid="adjust-block-dialog"
        onCancel={onClose}
      >
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Adjust Split/Rows/BPM</h3>
          <div className="flex text-center mt-4">
            <span className="w-6" />
            <p className="font-bold w-16 ml-1">Fix</p>
            <p className="font-bold w-44 pl-5">Before</p>
            <span className="w-5" />
            <p className="font-bold w-44 pr-3">After</p>
          </div>
          <div className="flex items-center mt-4">
            <input
              className={`radio${fixed === "split" ? " radio-primary" : ""}`}
              type="radio"
              checked={fixed === "split"}
              onChange={() => setFixed("split")}
            />
            <button
              className="btn btn-sm btn-ghost px-0 ml-1 min-w-16"
              onClick={() => setFixed("split")}
            >
              Split
            </button>
            <p
              className={`text-center w-44 pl-5 ${
                fixed === "split" ? " text-neutral" : ""
              }`}
            >
              {blocks[blockControllerMenuBlockIdx].split}
            </p>
            {/* heroicons arrow-right */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
            <p
              className={`text-xl text-center w-44 pr-3 ${
                fixed === "split" ? " text-neutral" : ""
              }`}
            >
              {adjustBlockDialogForm.split}
            </p>
          </div>
          <div className="flex gap-x-4 mt-2">
            <span className="min-w-2" />
            <span className="min-w-14" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-14"
              disabled={
                fixed === "split" ||
                (fixed === "bpm" &&
                  adjustBlockDialogForm.rows % adjustBlockDialogForm.split !==
                    0) ||
                (fixed === "bpm" &&
                  adjustBlockDialogForm.rows < adjustBlockDialogForm.split) ||
                (fixed === "rows" &&
                  adjustBlockDialogForm.bpm * adjustBlockDialogForm.split > 999)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : adjustBlockDialogForm.bpm * adjustBlockDialogForm.split,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : adjustBlockDialogForm.rows /
                        adjustBlockDialogForm.split,
                  split: 1,
                })
              }
            >
              MIN
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                adjustBlockDialogForm.split % 2 !== 0 ||
                adjustBlockDialogForm.split < 2 ||
                (fixed === "bpm" && adjustBlockDialogForm.rows % 2 !== 0) ||
                (fixed === "bpm" && adjustBlockDialogForm.rows < 2) ||
                (fixed === "rows" && adjustBlockDialogForm.bpm > 499.5)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : adjustBlockDialogForm.bpm * 2,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : adjustBlockDialogForm.rows / 2,
                  split: adjustBlockDialogForm.split / 2,
                })
              }
            >
              /2
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                adjustBlockDialogForm.split < 2 ||
                (fixed === "bpm" &&
                  (adjustBlockDialogForm.rows *
                    (adjustBlockDialogForm.split - 1)) %
                    adjustBlockDialogForm.split !==
                    0) ||
                (fixed === "bpm" &&
                  adjustBlockDialogForm.rows *
                    (adjustBlockDialogForm.split - 1) <
                    adjustBlockDialogForm.split) ||
                (fixed === "rows" &&
                  adjustBlockDialogForm.bpm * adjustBlockDialogForm.split >
                    999 * (adjustBlockDialogForm.split - 1))
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : (adjustBlockDialogForm.bpm *
                          adjustBlockDialogForm.split) /
                        (adjustBlockDialogForm.split - 1),
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : (adjustBlockDialogForm.rows *
                          (adjustBlockDialogForm.split - 1)) /
                        adjustBlockDialogForm.split,
                  split: adjustBlockDialogForm.split - 1,
                })
              }
            >
              -1
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                adjustBlockDialogForm.split > 127 ||
                (fixed === "bpm" &&
                  (adjustBlockDialogForm.rows *
                    (adjustBlockDialogForm.split + 1)) %
                    adjustBlockDialogForm.split !==
                    0) ||
                (fixed === "rows" &&
                  adjustBlockDialogForm.bpm * adjustBlockDialogForm.split * 10 <
                    adjustBlockDialogForm.split + 1)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : (adjustBlockDialogForm.bpm *
                          adjustBlockDialogForm.split) /
                        (adjustBlockDialogForm.split + 1),
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : (adjustBlockDialogForm.rows *
                          (adjustBlockDialogForm.split + 1)) /
                        adjustBlockDialogForm.split,
                  split: adjustBlockDialogForm.split + 1,
                })
              }
            >
              +1
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                adjustBlockDialogForm.split > 64 ||
                (fixed === "rows" && adjustBlockDialogForm.bpm < 0.2)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : adjustBlockDialogForm.bpm / 2,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : adjustBlockDialogForm.rows * 2,
                  split: adjustBlockDialogForm.split * 2,
                })
              }
            >
              x2
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-14"
              disabled={
                fixed === "split" ||
                (fixed === "bpm" &&
                  (adjustBlockDialogForm.rows * 128) %
                    adjustBlockDialogForm.split !==
                    0) ||
                (fixed === "rows" &&
                  adjustBlockDialogForm.bpm * adjustBlockDialogForm.split <
                    12.8)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : (adjustBlockDialogForm.bpm *
                          adjustBlockDialogForm.split) /
                        128,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : (adjustBlockDialogForm.rows * 128) /
                        adjustBlockDialogForm.split,
                  split: 128,
                })
              }
            >
              MAX
            </button>
          </div>
          <div className="divider my-2" />
          <div className="flex items-center">
            <input
              className={`radio${fixed === "rows" ? " radio-primary" : ""}`}
              type="radio"
              checked={fixed === "rows"}
              onChange={() => setFixed("rows")}
            />
            <button
              className="btn btn-sm btn-ghost px-0 ml-1 min-w-16"
              onClick={() => setFixed("rows")}
            >
              Rows
            </button>
            <p
              className={`text-center w-44 pl-5 ${
                fixed === "rows" ? " text-neutral" : ""
              }`}
            >
              {menuBlock.rows}
            </p>
            {/* heroicons arrow-right */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
            <p
              className={`text-xl text-center w-44 pr-3 ${
                fixed === "rows" ? " text-neutral" : ""
              }`}
            >
              {adjustBlockDialogForm.rows}
            </p>
          </div>
          <div className="flex gap-x-4 mt-2">
            <span className="min-w-2" />
            <span className="min-w-14" />
            <span className="min-w-14" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "rows" ||
                adjustBlockDialogForm.rows % 2 !== 0 ||
                adjustBlockDialogForm.rows < 2 ||
                (fixed === "bpm" && adjustBlockDialogForm.split % 2 !== 0) ||
                (fixed === "bpm" && adjustBlockDialogForm.split < 2) ||
                (fixed === "split" && adjustBlockDialogForm.bpm < 0.2)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : adjustBlockDialogForm.bpm / 2,
                  rows: adjustBlockDialogForm.rows / 2,
                  split:
                    fixed === "split"
                      ? adjustBlockDialogForm.split
                      : adjustBlockDialogForm.split / 2,
                })
              }
            >
              /2
            </button>
            <span className="min-w-11" />
            <span className="min-w-11" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "rows" ||
                (fixed === "bpm" && adjustBlockDialogForm.split > 64) ||
                (fixed === "split" && adjustBlockDialogForm.bpm > 499.5)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm:
                    fixed === "bpm"
                      ? adjustBlockDialogForm.bpm
                      : adjustBlockDialogForm.bpm * 2,
                  rows: adjustBlockDialogForm.rows * 2,
                  split:
                    fixed === "split"
                      ? adjustBlockDialogForm.split
                      : adjustBlockDialogForm.split * 2,
                })
              }
            >
              x2
            </button>
          </div>
          <div className="divider my-2" />
          <div className="flex items-center">
            <input
              className={`radio${fixed === "bpm" ? " radio-primary" : ""}`}
              type="radio"
              checked={fixed === "bpm"}
              onChange={() => setFixed("bpm")}
            />
            <button
              className="btn btn-sm btn-ghost px-0 ml-1 min-w-16"
              onClick={() => setFixed("bpm")}
            >
              BPM
            </button>
            <p
              className={`text-center w-44 pl-5 ${
                fixed === "bpm" ? " text-neutral" : ""
              }`}
            >
              {menuBlock.bpm}
            </p>
            {/* heroicons arrow-right */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
            <p
              className={`text-xl text-center w-44 pr-3 ${
                fixed === "bpm" ? " text-neutral" : ""
              }`}
            >
              {roundBpm(adjustBlockDialogForm.bpm)}
            </p>
          </div>
          <div className="flex gap-x-4 mt-2">
            <span className="min-w-2" />
            <span className="min-w-14" />
            <span className="min-w-14" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "bpm" ||
                adjustBlockDialogForm.bpm < 0.2 ||
                (fixed === "rows" && adjustBlockDialogForm.split > 64) ||
                (fixed === "split" && adjustBlockDialogForm.rows % 2 !== 0) ||
                (fixed === "split" && adjustBlockDialogForm.rows < 2)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm: adjustBlockDialogForm.bpm / 2,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : adjustBlockDialogForm.rows / 2,
                  split:
                    fixed === "split"
                      ? adjustBlockDialogForm.split
                      : adjustBlockDialogForm.split * 2,
                })
              }
            >
              /2
            </button>
            <span className="min-w-11" />
            <span className="min-w-11" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "bpm" ||
                adjustBlockDialogForm.bpm > 499.5 ||
                (fixed === "rows" && adjustBlockDialogForm.split % 2 !== 0) ||
                (fixed === "rows" && adjustBlockDialogForm.split < 2)
              }
              onClick={() =>
                setAdjustBlockDialogForm({
                  bpm: adjustBlockDialogForm.bpm * 2,
                  rows:
                    fixed === "rows"
                      ? adjustBlockDialogForm.rows
                      : adjustBlockDialogForm.rows * 2,
                  split:
                    fixed === "split"
                      ? adjustBlockDialogForm.split
                      : adjustBlockDialogForm.split / 2,
                })
              }
            >
              x2
            </button>
          </div>
          <form method="dialog" className="modal-action">
            <button className="btn btn-primary" onClick={onUpdate}>
              UPDATE
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={onClose}>
          <button />
        </form>
      </dialog>
    )
  );
}

export default AdjustBlockDialog;
