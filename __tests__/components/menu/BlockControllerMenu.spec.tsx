import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BlockControllerMenu from "../../../src/components/menu/BlockControllerMenu";
import { useStore } from "../../../src/hooks/useStore";

const mockResetBlockControllerMenuBlockIdx = vi.fn();
const mockResetBlockControllerMenuPosition = vi.fn();
const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockPushUndoSnapshot = vi.fn();
const mockResetRedoSnapshots = vi.fn();
const mockOpenEditBlockDialog = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useEditBlockDialog", () => ({
  default: () => ({ openEditBlockDialog: mockOpenEditBlockDialog }),
}));

vi.mock("../../../src/components/menu/MenuBackground", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <button type="button" data-testid="menu-background" onClick={onClose}>
      bg
    </button>
  ),
}));

vi.mock("../../../src/components/menu/MenuItem", () => ({
  default: ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
}));

describe("BlockControllerMenu", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = '<dialog id="adjust-block-dialog"></dialog>';
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: 0,
      resetBlockControllerMenuBlockIdx: mockResetBlockControllerMenuBlockIdx,
      blockControllerMenuPosition: { top: 10, left: 20 },
      resetBlockControllerMenuPosition: mockResetBlockControllerMenuPosition,
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
        { accumulatedRows: 4, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      setIsProtected: mockSetIsProtected,
      notes: [[], [], [], [], []],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });
  });
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    document.body.style.overflowY = "";
  });

  it("renders menu items when position is set", () => {
    // Given: open block menu
    const { getByText } = render(<BlockControllerMenu />);

    // When: inspecting menu
    // Then: core actions are visible
    expect(getByText("Edit")).toBeInTheDocument();
    expect(getByText("Add at Bottom")).toBeInTheDocument();
  });

  it("opens edit dialog from Edit action", async () => {
    // Given: open block menu
    const { getByText } = render(<BlockControllerMenu />);

    // When: Edit is clicked
    await userEvent.click(getByText("Edit"));

    // Then: edit dialog opens and position resets
    expect(mockOpenEditBlockDialog).toHaveBeenCalled();
    expect(mockResetBlockControllerMenuPosition).toHaveBeenCalled();
  });

  it("inserts block and merges or deletes blocks", async () => {
    // Given: open menu on middle block
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: 1,
      resetBlockControllerMenuBlockIdx: mockResetBlockControllerMenuBlockIdx,
      blockControllerMenuPosition: { top: 10, left: 20 },
      resetBlockControllerMenuPosition: mockResetBlockControllerMenuPosition,
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
        { accumulatedRows: 4, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
        { accumulatedRows: 8, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      setIsProtected: mockSetIsProtected,
      notes: [[{ rowIdx: 5, type: "X" }], [], [], [], []],
      setNotes: mockSetNotes,
      resetRedoSnapshots: mockResetRedoSnapshots,
      pushUndoSnapshot: mockPushUndoSnapshot,
    });
    const { getByText } = render(<BlockControllerMenu />);

    // When: insert, merge, and delete actions run
    await userEvent.click(getByText("Insert into Next"));
    await userEvent.click(getByText("Merge with Above"));
    await userEvent.click(getByText("Merge with Below"));
    await userEvent.click(getByText("Delete"));

    // Then: block and note mutations occur
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("opens adjust dialog from menu", async () => {
    // Given: adjust dialog element
    const showModal = vi.fn();
    const dialog = document.getElementById(
      "adjust-block-dialog"
    ) as HTMLDialogElement;
    dialog.showModal = showModal;
    const { getByText } = render(<BlockControllerMenu />);

    // When: adjust action is clicked
    await userEvent.click(getByText("Adjust Split/Rows/BPM"));

    // Then: adjust dialog opens
    expect(showModal).toHaveBeenCalled();
  });

  it("adds block copy at bottom", async () => {
    // Given: open block menu
    const { getByText } = render(<BlockControllerMenu />);

    // When: Add at Bottom is clicked
    await userEvent.click(getByText("Add at Bottom"));

    // Then: blocks update and menu closes
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockResetBlockControllerMenuBlockIdx).toHaveBeenCalled();
  });
});
