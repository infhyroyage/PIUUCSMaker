import { ChangeEvent, useState, useTransition } from "react";
import useNewUcsDialog from "../../hooks/useNewUcsDialog";
import { useStore } from "../../hooks/useStore";
import { DIALOG_Z_INDEX } from "../../services/styles";
import {
  validateBeat,
  validateBpm,
  validateDelay,
  validateRows,
  validateSplit,
} from "../../services/validations";
import { NewUCSDialogError, NewUCSDialogForm } from "../../types/dialog";
import { Note } from "../../types/ucs";

function NewUCSDialog() {
  const {
    setBlocks,
    setIsPerformance,
    setIsProtected,
    setNotes,
    resetRedoSnapshots,
    setUcsName,
    resetUndoSnapshots,
  } = useStore();
  const [form, setForm] = useState<NewUCSDialogForm>({
    beat: "4",
    bpm: "120",
    delay: "0",
    ucsName: "CS001",
    mode: "Single",
    rows: "50",
    split: "2",
  });
  const [errors, setErrors] = useState<NewUCSDialogError[]>([]);

  const { closeNewUcsDialog } = useNewUcsDialog();
  const [isPending, startTransition] = useTransition();

  const onCreate = () =>
    startTransition(() => {
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
        split !== null &&
        form.ucsName.length > 0
      ) {
        setBlocks([{ accumulatedRows: 0, beat, bpm, delay, rows, split }]);
        setIsPerformance(
          ["SinglePerformance", "DoublePerformance"].includes(form.mode)
        );
        setIsProtected(false);
        setNotes(
          Array(["Single", "SinglePerformance"].includes(form.mode) ? 5 : 10)
            .fill(null)
            .map<Note[]>(() => [])
        );
        resetRedoSnapshots();
        setUcsName(`${form.ucsName}.ucs`);
        resetUndoSnapshots();
        closeNewUcsDialog();
      } else {
        // バリデーションエラーのテキストフィールドをすべて表示
        const errors: NewUCSDialogError[] = [];
        if (beat === null) errors.push("Beat");
        if (bpm === null) errors.push("BPM");
        if (delay === null) errors.push("Delay(ms)");
        if (rows === null) errors.push("Rows");
        if (split === null) errors.push("Split");
        if (form.ucsName.length === 0) errors.push("UCS File Name");
        setErrors(errors);
      }
    });

  return (
    <dialog
      id="new-ucs-dialog"
      className="modal"
      style={{ zIndex: DIALOG_Z_INDEX }}
      data-testid="new-ucs-dialog"
    >
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6"
            disabled={isPending}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">New UCS</h3>
        <div className="flex flex-col gap-4 mt-4">
          <label className="form-control w-full">
            <div
              className={`label text-md font-bold label-text${
                errors.includes("UCS File Name") ? " text-error" : ""
              }`}
            >
              UCS File Name
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("UCS File Name") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, ucsName: event.target.value });
              }}
              type="text"
              value={form.ucsName}
            />
            {errors.includes("UCS File Name") && (
              <div className="label text-md label-text text-error">
                Not Set Extension(.ucs)
              </div>
            )}
          </label>
          <label>
            <div className="label text-md font-bold label-text">Mode</div>
            <select
              className="select select-bordered select-sm w-full"
              disabled={isPending}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                setForm({ ...form, mode: event.target.value });
              }}
              value={form.mode}
            >
              <option value="Single">Single</option>
              <option value="SinglePerformance">Single Performance</option>
              <option value="Double">Double</option>
              <option value="DoublePerformance">Double Performance</option>
            </select>
          </label>
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
                errors.includes("Delay(ms)") ? " text-error" : ""
              }`}
            >
              Delay(ms)
            </div>
            <input
              className={`input input-sm input-bordered w-full${
                errors.includes("Delay(ms)") ? " input-error" : ""
              }`}
              disabled={isPending}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, delay: event.target.value });
              }}
              type="text"
              value={form.delay}
            />
            {errors.includes("Delay(ms)") && (
              <div className="label text-md label-text text-error">
                Offset time of Scrolling(-999999 - 999999)
              </div>
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
            onClick={onCreate}
          >
            CREATE
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={isPending} />
      </form>
    </dialog>
  );
}

export default NewUCSDialog;
