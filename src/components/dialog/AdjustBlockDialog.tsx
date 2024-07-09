import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  blockControllerMenuBlockIdxState,
  blocksState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../services/atoms";
import { DIALOG_Z_INDEX } from "../../services/styles";
import { roundBpm } from "../../services/validations";
import {
  AdjustBlockDialogForm,
  AdjustBlockDialogFormFixed,
} from "../../types/dialog";
import { Block, ChartSnapshot, Note } from "../../types/ucs";

function AdjustBlockDialog() {
  const [fixed, setFixed] = useState<AdjustBlockDialogFormFixed>("bpm");
  const [form, setForm] = useState<AdjustBlockDialogForm>({
    bpm: -1,
    rows: -1,
    split: -1,
  });
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const [menuBlockIdx, setMenuBlockIdx] = useRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const menuBlock = useMemo(
    () => (menuBlockIdx === null ? null : blocks[menuBlockIdx]),
    [blocks, menuBlockIdx]
  );

  useEffect(
    () =>
      setForm({
        bpm: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].bpm,
        rows: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].rows,
        split: menuBlockIdx === null ? -1 : blocks[menuBlockIdx].split,
      }),
    [blocks, menuBlockIdx, setForm]
  );

  const onUpdate = useCallback(() => {
    // BlockControllerMenuのメニューを開いていない場合はNOP
    if (menuBlockIdx === null) return;

    // menuBlockIdx番目の譜面のブロックの行数の差分
    const deltaRows: number = Number(form.rows) - blocks[menuBlockIdx].rows;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([
      ...undoSnapshots,
      { blocks, notes: deltaRows === 0 ? null : notes },
    ]);
    setRedoSnapshots([]);

    // menuBlockIdx番目以降の譜面のブロックをすべて更新
    const updatedBlocks: Block[] = [...Array(blocks.length)].map(
      (_, blockIdx: number) =>
        blockIdx === menuBlockIdx
          ? {
              accumulatedRows: blocks[menuBlockIdx].accumulatedRows,
              beat: blocks[menuBlockIdx].beat,
              bpm: roundBpm(form.bpm),
              delay: blocks[menuBlockIdx].delay,
              rows: form.rows,
              split: form.split,
            }
          : blockIdx > menuBlockIdx
          ? {
              ...blocks[blockIdx],
              accumulatedRows:
                blocks[blockIdx - 1].accumulatedRows +
                blocks[blockIdx - 1].rows +
                deltaRows,
            }
          : blocks[blockIdx]
    );

    // 行数を変更した場合のみ、menuBlockIdx番目以降の譜面のブロックに該当する
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
    let updatedNotes: Note[][] = [...notes];
    if (deltaRows !== 0) {
      // 以下の譜面のブロックに該当する単ノート/ホールドの始点/ホールドの中間/ホールドの終点をすべて更新
      // * (menuBlockIdx - 1)番目以前: 更新しない
      // * menuBlockIdx番目          : 譜面全体の行インデックスをスケーリング(空白 < X < H < M < W)
      // * (menuBlockIdx + 1)番目以降: 譜面全体の行インデックスを譜面のブロックの行数の差分ズラす
      updatedNotes = [...notes].map((ns: Note[]) => [
        // (menuBlockIdx - 1)番目以前の譜面のブロック
        ...ns.filter(
          (note: Note) => note.rowIdx < blocks[menuBlockIdx].accumulatedRows
        ),
        // menuBlockIdx番目の譜面のブロック
        ...ns
          .filter(
            (note: Note) =>
              note.rowIdx >= blocks[menuBlockIdx].accumulatedRows &&
              note.rowIdx <
                blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
          )
          .reduce((prev: Note[], note: Note) => {
            const scaledRowIdx: number =
              blocks[menuBlockIdx].accumulatedRows +
              Math.floor(
                ((note.rowIdx - blocks[menuBlockIdx].accumulatedRows) *
                  Number(form.rows)) /
                  blocks[menuBlockIdx].rows
              );
            const prevScaledNote: Note | undefined = prev.find(
              (note: Note) => note.rowIdx === scaledRowIdx
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
        // (menuBlockIdx + 1)番目以降の譜面のブロック
        ...ns
          .filter(
            (note: Note) =>
              note.rowIdx >=
              blocks[menuBlockIdx].accumulatedRows + blocks[menuBlockIdx].rows
          )
          .map((note: Note) => {
            return { rowIdx: note.rowIdx + deltaRows, type: note.type };
          }),
      ]);
    }

    setIsProtected(true);

    setBlocks(updatedBlocks);
    if (deltaRows !== 0) setNotes(updatedNotes);

    setMenuBlockIdx(null);
  }, [
    blocks,
    form,
    menuBlockIdx,
    notes,
    setBlocks,
    setIsProtected,
    setMenuBlockIdx,
    setNotes,
    setRedoSnapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  const onClose = useCallback(() => setMenuBlockIdx(null), [setMenuBlockIdx]);

  return (
    menuBlockIdx !== null &&
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
              {blocks[menuBlockIdx].split}
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
              {form.split}
            </p>
          </div>
          <div className="flex gap-x-4 mt-2">
            <span className="min-w-2" />
            <span className="min-w-14" />
            <button
              className="btn btn-primary btn-sm px-0 min-w-14"
              disabled={
                fixed === "split" ||
                (fixed === "bpm" && form.rows % form.split !== 0) ||
                (fixed === "bpm" && form.rows < form.split) ||
                (fixed === "rows" && form.bpm * form.split > 999)
              }
              onClick={() =>
                setForm({
                  bpm: fixed === "bpm" ? form.bpm : form.bpm * form.split,
                  rows: fixed === "rows" ? form.rows : form.rows / form.split,
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
                form.split % 2 !== 0 ||
                form.split < 2 ||
                (fixed === "bpm" && form.rows % 2 !== 0) ||
                (fixed === "bpm" && form.rows < 2) ||
                (fixed === "rows" && form.bpm > 499.5)
              }
              onClick={() =>
                setForm({
                  bpm: fixed === "bpm" ? form.bpm : form.bpm * 2,
                  rows: fixed === "rows" ? form.rows : form.rows / 2,
                  split: form.split / 2,
                })
              }
            >
              /2
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                form.split < 2 ||
                (fixed === "bpm" &&
                  (form.rows * (form.split - 1)) % form.split !== 0) ||
                (fixed === "bpm" &&
                  form.rows * (form.split - 1) < form.split) ||
                (fixed === "rows" &&
                  form.bpm * form.split > 999 * (form.split - 1))
              }
              onClick={() =>
                setForm({
                  bpm:
                    fixed === "bpm"
                      ? form.bpm
                      : (form.bpm * form.split) / (form.split - 1),
                  rows:
                    fixed === "rows"
                      ? form.rows
                      : (form.rows * (form.split - 1)) / form.split,
                  split: form.split - 1,
                })
              }
            >
              -1
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                form.split > 127 ||
                (fixed === "bpm" &&
                  (form.rows * (form.split + 1)) % form.split !== 0) ||
                (fixed === "rows" &&
                  form.bpm * form.split * 10 < form.split + 1)
              }
              onClick={() =>
                setForm({
                  bpm:
                    fixed === "bpm"
                      ? form.bpm
                      : (form.bpm * form.split) / (form.split + 1),
                  rows:
                    fixed === "rows"
                      ? form.rows
                      : (form.rows * (form.split + 1)) / form.split,
                  split: form.split + 1,
                })
              }
            >
              +1
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-11"
              disabled={
                fixed === "split" ||
                form.split > 64 ||
                (fixed === "rows" && form.bpm < 0.2)
              }
              onClick={() =>
                setForm({
                  bpm: fixed === "bpm" ? form.bpm : form.bpm / 2,
                  rows: fixed === "rows" ? form.rows : form.rows * 2,
                  split: form.split * 2,
                })
              }
            >
              x2
            </button>
            <button
              className="btn btn-primary btn-sm px-0 min-w-14"
              disabled={
                fixed === "split" ||
                (fixed === "bpm" && (form.rows * 128) % form.split !== 0) ||
                (fixed === "rows" && form.bpm * form.split < 12.8)
              }
              onClick={() =>
                setForm({
                  bpm:
                    fixed === "bpm" ? form.bpm : (form.bpm * form.split) / 128,
                  rows:
                    fixed === "rows"
                      ? form.rows
                      : (form.rows * 128) / form.split,
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
              {form.rows}
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
                form.rows % 2 !== 0 ||
                form.rows < 2 ||
                (fixed === "bpm" && form.split % 2 !== 0) ||
                (fixed === "bpm" && form.split < 2) ||
                (fixed === "split" && form.bpm < 0.2)
              }
              onClick={() =>
                setForm({
                  bpm: fixed === "bpm" ? form.bpm : form.bpm / 2,
                  rows: form.rows / 2,
                  split: fixed === "split" ? form.split : form.split / 2,
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
                (fixed === "bpm" && form.split > 64) ||
                (fixed === "split" && form.bpm > 499.5)
              }
              onClick={() =>
                setForm({
                  bpm: fixed === "bpm" ? form.bpm : form.bpm * 2,
                  rows: form.rows * 2,
                  split: fixed === "split" ? form.split : form.split * 2,
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
              {roundBpm(form.bpm)}
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
                form.bpm < 0.2 ||
                (fixed === "rows" && form.split > 64) ||
                (fixed === "split" && form.rows % 2 !== 0) ||
                (fixed === "split" && form.rows < 2)
              }
              onClick={() =>
                setForm({
                  bpm: form.bpm / 2,
                  rows: fixed === "rows" ? form.rows : form.rows / 2,
                  split: fixed === "split" ? form.split : form.split * 2,
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
                form.bpm > 499.5 ||
                (fixed === "rows" && form.split % 2 !== 0) ||
                (fixed === "rows" && form.split < 2)
              }
              onClick={() =>
                setForm({
                  bpm: form.bpm * 2,
                  rows: fixed === "rows" ? form.rows : form.rows * 2,
                  split: fixed === "split" ? form.split : form.split / 2,
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
