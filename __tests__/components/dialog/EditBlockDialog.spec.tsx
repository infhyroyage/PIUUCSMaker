import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import EditBlockDialog from "../../../src/components/dialog/EditBlockDialog";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetEditBlockDialogForm = vi.fn();
const mockCloseEditBlockDialog = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useEditBlockDialog", () => ({
  default: () => ({ closeEditBlockDialog: mockCloseEditBlockDialog }),
}));

describe("EditBlockDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: 0,
      resetBlockControllerMenuBlockIdx: vi.fn(),
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      setIsProtected: vi.fn(),
      editBlockDialogForm: {
        beat: "4",
        bpm: "120",
        delay: "0",
        rows: "4",
        split: "2",
      },
      setEditBlockDialogForm: mockSetEditBlockDialogForm,
      resetEditBlockDialogForm: vi.fn(),
      notes: [[], [], [], [], []],
      setNotes: mockSetNotes,
      resetRedoSnapshots: vi.fn(),
      pushUndoSnapshot: vi.fn(),
    });
  });
  afterEach(() => cleanup());

  it("updates block values on valid submit", async () => {
    // Given: edit dialog for first block
    const { getByText } = render(<EditBlockDialog />);

    // When: UPDATE is clicked
    await userEvent.click(getByText("UPDATE"));

    // Then: blocks are updated and dialog closes
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockCloseEditBlockDialog).toHaveBeenCalled();
  });

  it("shows validation errors for invalid beat", async () => {
    // Given: invalid beat in form
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: 0,
      resetBlockControllerMenuBlockIdx: vi.fn(),
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      setIsProtected: vi.fn(),
      editBlockDialogForm: {
        beat: "0",
        bpm: "120",
        delay: "0",
        rows: "4",
        split: "2",
      },
      setEditBlockDialogForm: mockSetEditBlockDialogForm,
      resetEditBlockDialogForm: vi.fn(),
      notes: [[], [], [], [], []],
      setNotes: mockSetNotes,
      resetRedoSnapshots: vi.fn(),
      pushUndoSnapshot: vi.fn(),
    });

    const { getByText } = render(<EditBlockDialog />);

    // When: UPDATE is clicked
    await userEvent.click(getByText("UPDATE"));

    // Then: beat validation message appears
    expect(
      getByText("Number of 4th Beats per Measure(1 - 64)")
    ).toBeInTheDocument();
  });
});
