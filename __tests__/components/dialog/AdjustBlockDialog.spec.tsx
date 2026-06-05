import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import AdjustBlockDialog from "../../../src/components/dialog/AdjustBlockDialog";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetAdjustBlockDialogForm = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

describe("AdjustBlockDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: 0,
      resetBlockControllerMenuBlockIdx: vi.fn(),
      adjustBlockDialogForm: { bpm: 120, rows: 4, split: 2 },
      setAdjustBlockDialogForm: mockSetAdjustBlockDialogForm,
      resetAdjustBlockDialogForm: vi.fn(),
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      setBlocks: mockSetBlocks,
      setIsProtected: vi.fn(),
      notes: [[], [], [], [], []],
      setNotes: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      pushUndoSnapshot: vi.fn(),
    });
  });
  afterEach(() => cleanup());

  it("renders dialog when block index is set", () => {
    // Given: selected block
    const { getByTestId } = render(<AdjustBlockDialog />);

    // When: dialog renders
    // Then: adjust dialog is visible
    expect(getByTestId("adjust-block-dialog")).toBeInTheDocument();
  });

  it("applies MIN and MAX adjustments for split", async () => {
    // Given: split is fixed target
    const { getByText } = render(<AdjustBlockDialog />);
    await userEvent.click(getByText("Split"));

    // When: MIN and MAX are clicked
    await userEvent.click(getByText("MIN"));
    await userEvent.click(getByText("MAX"));

    // Then: form updates through store
    expect(mockSetAdjustBlockDialogForm).toHaveBeenCalled();
  });

  it("adjusts split and rows via control buttons", async () => {
    // Given: open adjust dialog
    const { getByText, getAllByText } = render(<AdjustBlockDialog />);

    // When: fix target and adjustment buttons are used
    await userEvent.click(getByText("Rows"));
    await userEvent.click(getAllByText("x2")[0]);
    await userEvent.click(getByText("Split"));
    await userEvent.click(getAllByText("/2")[0]);

    // Then: form values are updated through store
    expect(mockSetAdjustBlockDialogForm).toHaveBeenCalled();
  });

  it("updates blocks when UPDATE is clicked", async () => {
    // Given: open adjust dialog
    const { getByText } = render(<AdjustBlockDialog />);

    // When: UPDATE is clicked
    await userEvent.click(getByText("UPDATE"));

    // Then: blocks are updated
    expect(mockSetBlocks).toHaveBeenCalled();
  });

  it("renders nothing without selected block", () => {
    // Given: no selected block
    (useStore as unknown as Mock).mockReturnValue({
      blockControllerMenuBlockIdx: null,
      resetBlockControllerMenuBlockIdx: vi.fn(),
      adjustBlockDialogForm: { bpm: -1, rows: -1, split: -1 },
      setAdjustBlockDialogForm: mockSetAdjustBlockDialogForm,
      resetAdjustBlockDialogForm: vi.fn(),
      blocks: [],
      setBlocks: mockSetBlocks,
      setIsProtected: vi.fn(),
      notes: [],
      setNotes: vi.fn(),
      resetRedoSnapshots: vi.fn(),
      pushUndoSnapshot: vi.fn(),
    });

    // When: dialog renders
    const { container } = render(<AdjustBlockDialog />);

    // Then: output is empty
    expect(container.firstChild).toBeNull();
  });
});
