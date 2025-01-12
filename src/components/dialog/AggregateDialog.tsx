import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useStore } from "../../hooks/useStore";
import { NOTE_BINARIES } from "../../services/assets";
import { notesState } from "../../services/atoms";
import { DIALOG_Z_INDEX } from "../../services/styles";
import { Note } from "../../types/ucs";

export const AggregateDialog = () => {
  const { noteSize } = useStore();
  const notes = useRecoilValue<Note[][]>(notesState);

  const totalCombo = useMemo(
    () =>
      notes.length === 0
        ? -1
        : new Set(notes.flat().map((note) => note.rowIdx)).size,
    [notes]
  );

  const maxWidth = useMemo(() => {
    return Math.max(
      notes.length * noteSize + (notes.length - 1) * 2 + 24 * 2,
      512
    );
  }, [notes, noteSize]);

  return (
    <dialog
      id="aggregate-dialog"
      className="modal"
      style={{ zIndex: DIALOG_Z_INDEX }}
      data-testid="aggregate-dialog"
    >
      <div className="modal-box" style={{ maxWidth }}>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Aggregate</h3>
        <h3 className="text-lg text-center justify-center pt-4">
          Total Combo:
          <span className="ml-2">
            {totalCombo === -1 ? (
              <span
                className="skeleton h-7"
                style={{ width: `${noteSize}px` }}
              />
            ) : (
              <span className="font-bold">{totalCombo}</span>
            )}
          </span>
        </h3>
        <div className="flex justify-center items-center gap-x-0.5 pt-4">
          {[...Array(notes.length)].map((_, column: number) => (
            <div key={column}>
              <img
                src={NOTE_BINARIES[column % 5]}
                alt={`note${column % 5}`}
                style={{ width: noteSize, height: noteSize }}
              />
              {totalCombo === -1 ? (
                <span
                  className="skeleton h-6"
                  style={{ width: `${noteSize}px` }}
                />
              ) : (
                <p className="text-sm text-center pt-1">
                  {notes[column].length}
                </p>
              )}
              {totalCombo === -1 ? (
                <span
                  className="skeleton h-4"
                  style={{ width: `${noteSize}px` }}
                />
              ) : (
                <p className="text-xs text-center">
                  {totalCombo === 0
                    ? "-"
                    : Math.round((100 * notes[column].length) / totalCombo)}
                  %
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button />
      </form>
    </dialog>
  );
};
