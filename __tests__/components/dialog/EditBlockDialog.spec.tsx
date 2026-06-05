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
const mockResetBlockControllerMenuBlockIdx = vi.fn();
const mockPushUndoSnapshot = vi.fn();

function buildStore(overrides: Record<string, unknown> = {}) {
  const editBlockDialogForm = {
    beat: "4",
    bpm: "120",
    delay: "0",
    rows: "8",
    split: "4",
  };
  return {
    blockControllerMenuBlockIdx: 0,
    resetBlockControllerMenuBlockIdx: mockResetBlockControllerMenuBlockIdx,
    blocks: [
      { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 8, split: 4 },
      { accumulatedRows: 8, beat: 4, bpm: 120, delay: 0, rows: 4, split: 4 },
    ],
    setBlocks: mockSetBlocks,
    setIsProtected: vi.fn(),
    editBlockDialogForm,
    setEditBlockDialogForm: (form: typeof editBlockDialogForm) => {
      Object.assign(editBlockDialogForm, form);
      mockSetEditBlockDialogForm(form);
    },
    resetEditBlockDialogForm: vi.fn(),
    notes: [
      [
        { rowIdx: 0, type: "X" },
        { rowIdx: 2, type: "M" },
        { rowIdx: 3, type: "H" },
        { rowIdx: 4, type: "W" },
      ],
      [{ rowIdx: 10, type: "X" }],
      [],
      [],
      [],
    ],
    setNotes: mockSetNotes,
    resetRedoSnapshots: vi.fn(),
    pushUndoSnapshot: mockPushUndoSnapshot,
    ...overrides,
  };
}

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useEditBlockDialog", () => ({
  default: () => ({ closeEditBlockDialog: mockCloseEditBlockDialog }),
}));

function renderOpenDialog() {
  const view = render(<EditBlockDialog />);
  view.getByTestId("edit-block-dialog").showModal();
  return view;
}

describe("EditBlockDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockImplementation(() => buildStore());
  });
  afterEach(() => cleanup());

  it("updates block values on valid submit", async () => {
    const { getByText } = renderOpenDialog();
    await userEvent.click(getByText("UPDATE"));
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockCloseEditBlockDialog).toHaveBeenCalled();
  });

  it("scales notes when rows change", async () => {
    const { getByText, getByDisplayValue } = renderOpenDialog();
    await userEvent.clear(getByDisplayValue("8"));
    await userEvent.type(getByDisplayValue("8"), "16");
    await userEvent.click(getByText("UPDATE"));
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockPushUndoSnapshot).toHaveBeenCalled();
  });

  it("shows ignored delay warning for non-first blocks", () => {
    (useStore as unknown as Mock).mockImplementation(() =>
      buildStore({
        blockControllerMenuBlockIdx: 1,
        editBlockDialogForm: {
          beat: "4",
          bpm: "120",
          delay: "100",
          rows: "4",
          split: "4",
        },
      })
    );
    const { getByText } = renderOpenDialog();
    expect(
      getByText("⚠Ignore above value and assume 0 automatically except 1st block⚠")
    ).toBeInTheDocument();
  });

  it("updates form fields on input change", async () => {
    const { getByDisplayValue } = renderOpenDialog();
    const bpmInput = getByDisplayValue("120");
    await userEvent.clear(bpmInput);
    await userEvent.type(bpmInput, "140");
    expect(mockSetEditBlockDialogForm).toHaveBeenCalled();
  });

  it("shows validation errors for invalid fields", async () => {
    (useStore as unknown as Mock).mockImplementation(() =>
      buildStore({
        editBlockDialogForm: {
          beat: "0",
          bpm: "abc",
          delay: "bad",
          rows: "0",
          split: "0",
        },
      })
    );
    const { getByText } = renderOpenDialog();
    await userEvent.click(getByText("UPDATE"));
    expect(getByText("Number of 4th Beats per Measure(1 - 64)")).toBeInTheDocument();
    expect(
      getByText("Number of 4th Beats per Minute(0.1 - 999)")
    ).toBeInTheDocument();
    expect(
      getByText("Offset time of Scrolling(-999999 - 999999)")
    ).toBeInTheDocument();
    expect(getByText("Number of UCS File's Rows(Over 1)")).toBeInTheDocument();
    expect(
      getByText("Number of UCS File's Rows per 4th Beat(1 - 128)")
    ).toBeInTheDocument();
  });

  it("closes dialog via close button", async () => {
    const { getByText } = renderOpenDialog();
    await userEvent.click(getByText("✕"));
    expect(mockResetBlockControllerMenuBlockIdx).toHaveBeenCalled();
  });
});
