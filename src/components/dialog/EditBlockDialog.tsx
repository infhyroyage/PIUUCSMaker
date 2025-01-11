import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useEditBlockDialog from "../../hooks/useEditBlockDialog";
import { useStore } from "../../hooks/useStore";
import {
  blocksState,
  isProtectedState,
  notesState,
  redoSnapshotsState,
  undoSnapshotsState,
} from "../../services/atoms";
import { DIALOG_Z_INDEX } from "../../services/styles";
import {
  validateBeat,
  validateBpm,
  validateDelay,
  validateRows,
  validateSplit,
} from "../../services/validations";
import { EditBlockDialogError, EditBlockDialogForm } from "../../types/dialog";
import { Block, ChartSnapshot, Note } from "../../types/ucs";

function EditBlockDialog() {
  const { blockControllerMenuBlockIdx, resetBlockControllerMenuBlockIdx } =
    useStore();
  const [errors, setErrors] = useState<EditBlockDialogError[]>([]);
  const [form, setForm] = useState<EditBlockDialogForm>({
    beat: "",
    bpm: "",
    delay: "",
    rows: "",
    split: "",
  });
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoSnapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  const { closeEditBlockDialog } = useEditBlockDialog();
  const [isPending, startTransition] = useTransition();

  useEffect(
    () =>
      setForm({
        beat:
          blockControllerMenuBlockIdx === null
            ? ""
            : `${blocks[blockControllerMenuBlockIdx].beat}`,
        bpm:
          blockControllerMenuBlockIdx === null
            ? ""
            : `${blocks[blockControllerMenuBlockIdx].bpm}`,
        delay:
          blockControllerMenuBlockIdx === null
            ? ""
            : `${blocks[blockControllerMenuBlockIdx].delay}`,
        rows:
          blockControllerMenuBlockIdx === null
            ? ""
            : `${blocks[blockControllerMenuBlockIdx].rows}`,
        split:
          blockControllerMenuBlockIdx === null
            ? ""
            : `${blocks[blockControllerMenuBlockIdx].split}`,
      }),
    [blocks, blockControllerMenuBlockIdx, setForm]
  );

  // 最初以外の譜面のブロックの場合は入力したDelay値を無視する警告フラグ
  const isIgnoredDelay = useMemo(() => {
    if (
      blockControllerMenuBlockIdx === null ||
      blockControllerMenuBlockIdx === 0
    )
      return false;

    const delay: number = Number(form.delay);
    return !Number.isNaN(delay) && delay !== 0;
  }, [blockControllerMenuBlockIdx, form.delay]);

  const onUpdate = useCallback(
    () =>
      startTransition(() => {
        // BlockControllerMenuのメニューを開いていない場合はNOP
        if (blockControllerMenuBlockIdx === null) return;

        // バリデーションチェック
        const beat: number | null = validateBeat(form.beat);
        const bpm: number | null = validateBpm(form.bpm);
        const delay: number | null = validateDelay(form.delay);
        const rows: number | null = validateRows(form.rows);
        const split: number | null = validateSplit(form.split);
        if (
          beat !== null &&
          bpm !== null &&
          delay !== null &&
          rows !== null &&
          split !== null
        ) {
          // blockControllerMenuBlockIdx番目の譜面のブロックの行数の差分
          const deltaRows: number =
            rows - blocks[blockControllerMenuBlockIdx].rows;

          // 元に戻す/やり直すスナップショットの集合を更新
          setUndoSnapshots([
            ...undoSnapshots,
            { blocks, notes: deltaRows === 0 ? null : notes },
          ]);
          setRedoSnapshots([]);

          // blockControllerMenuBlockIdx番目以降の譜面のブロックをすべて更新
          const updatedBlocks: Block[] = [...Array(blocks.length)].map(
            (_, blockIdx: number) =>
              blockIdx === blockControllerMenuBlockIdx
                ? {
                    accumulatedRows:
                      blocks[blockControllerMenuBlockIdx].accumulatedRows,
                    beat: beat,
                    bpm: bpm,
                    delay: delay,
                    rows: rows,
                    split: split,
                  }
                : blockIdx > blockControllerMenuBlockIdx
                ? {
                    ...blocks[blockIdx],
                    accumulatedRows:
                      blocks[blockIdx - 1].accumulatedRows +
                      blocks[blockIdx - 1].rows +
                      deltaRows,
                  }
                : blocks[blockIdx]
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
                  note.rowIdx <
                  blocks[blockControllerMenuBlockIdx].accumulatedRows
              ),
              // blockControllerMenuBlockIdx番目の譜面のブロック
              ...ns
                .filter(
                  (note: Note) =>
                    note.rowIdx >=
                      blocks[blockControllerMenuBlockIdx].accumulatedRows &&
                    note.rowIdx <
                      blocks[blockControllerMenuBlockIdx].accumulatedRows +
                        blocks[blockControllerMenuBlockIdx].rows
                )
                .reduce((prev: Note[], note: Note) => {
                  const scaledRowIdx: number =
                    blocks[blockControllerMenuBlockIdx].accumulatedRows +
                    Math.floor(
                      ((note.rowIdx -
                        blocks[blockControllerMenuBlockIdx].accumulatedRows) *
                        rows) /
                        blocks[blockControllerMenuBlockIdx].rows
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
              // (blockControllerMenuBlockIdx + 1)番目以降の譜面のブロック
              ...ns
                .filter(
                  (note: Note) =>
                    note.rowIdx >=
                    blocks[blockControllerMenuBlockIdx].accumulatedRows +
                      blocks[blockControllerMenuBlockIdx].rows
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
          closeEditBlockDialog();
        } else {
          // バリデーションエラーのテキストフィールドをすべて表示
          const errors: EditBlockDialogError[] = [];
          if (beat === null) errors.push("Beat");
          if (bpm === null) errors.push("BPM");
          if (delay === null) errors.push("Delay(ms)");
          if (rows === null) errors.push("Rows");
          if (split === null) errors.push("Split");
          setErrors(errors);
        }
      }),
    [
      blocks,
      closeEditBlockDialog,
      form,
      blockControllerMenuBlockIdx,
      notes,
      setBlocks,
      setIsProtected,
      resetBlockControllerMenuBlockIdx,
      setNotes,
      setErrors,
      setRedoSnapshots,
      setUndoSnapshots,
      undoSnapshots,
    ]
  );

  const onClose = useCallback(() => {
    setErrors([]);
    setForm({
      beat: "",
      bpm: "",
      delay: "",
      rows: "",
      split: "",
    });
    resetBlockControllerMenuBlockIdx();
  }, [setErrors, setForm, resetBlockControllerMenuBlockIdx]);

  return (
    <dialog
      id="edit-block-dialog"
      className="modal"
      style={{ zIndex: DIALOG_Z_INDEX }}
      data-testid="edit-block-dialog"
      onCancel={onClose}
    >
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6"
            onClick={onClose}
            disabled={isPending}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Edit Block</h3>
        <div className="flex flex-col gap-4 mt-4">
          <label>
            <div
              className={`label text-md font-bold label-text${
                errors.includes("BPM") ? " text-error" : ""
              }`}
            >
              BPM
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("BPM") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, bpm: event.target.value });
              }}
              type="number"
              value={form.bpm}
            />
            {errors.includes("BPM") && (
              <div className="label text-md label-text text-error">
                Number of 4th Beats per Minute(0.1 - 999)
              </div>
            )}
          </label>
          <label>
            <div
              className={`label text-md font-bold label-text${
                isIgnoredDelay
                  ? " text-warning"
                  : errors.includes("Delay(ms)")
                  ? " text-error"
                  : ""
              }`}
            >
              Delay(ms)
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                isIgnoredDelay
                  ? " input-warning"
                  : errors.includes("Delay(ms)")
                  ? " input-error"
                  : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, delay: event.target.value });
              }}
              type="number"
              value={form.delay}
            />
            {isIgnoredDelay ? (
              <div className="label text-md label-text text-warning">
                ⚠Ignore above value and assume 0 automatically except 1st block⚠
              </div>
            ) : (
              errors.includes("Delay(ms)") && (
                <div className="label text-md label-text text-error">
                  Offset time of Scrolling(-999999 - 999999)
                </div>
              )
            )}
          </label>
          <label>
            <div
              className={`label text-md font-bold label-text${
                errors.includes("Split") ? " text-error" : ""
              }`}
            >
              Split
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("Split") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, split: event.target.value });
              }}
              type="number"
              value={form.split}
            />
            {errors.includes("Split") && (
              <div className="label text-md label-text text-error">
                {"Number of UCS File's Rows per 4th Beat(1 - 128)"}
              </div>
            )}
          </label>
          <label>
            <div
              className={`label text-md font-bold label-text${
                errors.includes("Beat") ? " text-error" : ""
              }`}
            >
              Beat
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("Beat") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, beat: event.target.value });
              }}
              type="number"
              value={form.beat}
            />
            {errors.includes("Beat") && (
              <div className="label text-md label-text text-error">
                Number of 4th Beats per Measure(1 - 64)
              </div>
            )}
          </label>
          <label>
            <div
              className={`label text-md font-bold label-text${
                errors.includes("Rows") ? " text-error" : ""
              }`}
            >
              Rows
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("Rows") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, rows: event.target.value });
              }}
              type="number"
              value={form.rows}
            />
            {errors.includes("Rows") && (
              <div className="label text-md label-text text-error">
                {"Number of UCS File's Rows(Over 1)"}
              </div>
            )}
          </label>
        </div>
        <form method="dialog" className="modal-action">
          <button
            className="btn btn-primary"
            disabled={isPending}
            onClick={onUpdate}
          >
            UPDATE
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button disabled={isPending} />
      </form>
    </dialog>
  );
}

export default EditBlockDialog;
