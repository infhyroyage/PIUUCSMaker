import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import AdjustBlockDialog from "../../../src/components/dialog/AdjustBlockDialog";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetIsProtected = vi.fn();
const mockResetBlockControllerMenuBlockIdx = vi.fn();
const mockResetAdjustBlockDialogForm = vi.fn();
const mockPushUndoSnapshot = vi.fn();
const mockResetRedoSnapshots = vi.fn();

function createAdjustStore(
  overrides: Partial<ReturnType<typeof buildStore>> = {}
) {
  const store = buildStore();
  return { ...store, ...overrides };
}

function buildStore() {
  const adjustBlockDialogForm = { bpm: 120, rows: 8, split: 4 };
  const blocks = [
    { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 8, split: 4 },
    { accumulatedRows: 8, beat: 4, bpm: 120, delay: 0, rows: 4, split: 4 },
  ];
  const notes = [
    [
      { rowIdx: 0, type: "X" },
      { rowIdx: 2, type: "M" },
      { rowIdx: 3, type: "H" },
      { rowIdx: 4, type: "W" },
    ],
    [],
    [],
    [],
    [],
  ];

  return {
    blockControllerMenuBlockIdx: 0,
    resetBlockControllerMenuBlockIdx: mockResetBlockControllerMenuBlockIdx,
    adjustBlockDialogForm,
    setAdjustBlockDialogForm: (form: typeof adjustBlockDialogForm) => {
      Object.assign(adjustBlockDialogForm, form);
    },
    resetAdjustBlockDialogForm: mockResetAdjustBlockDialogForm,
    blocks,
    setBlocks: mockSetBlocks,
    setIsProtected: mockSetIsProtected,
    notes,
    setNotes: mockSetNotes,
    resetRedoSnapshots: mockResetRedoSnapshots,
    pushUndoSnapshot: mockPushUndoSnapshot,
  };
}

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

function renderOpenDialog() {
  const view = render(<AdjustBlockDialog />);
  view.getByTestId("adjust-block-dialog").showModal();
  return view;
}

describe("AdjustBlockDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockImplementation(() => createAdjustStore());
  });
  afterEach(() => cleanup());

  it("renders dialog when block index is set", () => {
    const { getByTestId } = render(<AdjustBlockDialog />);
    expect(getByTestId("adjust-block-dialog")).toBeInTheDocument();
  });

  it("renders nothing without selected block", () => {
    (useStore as unknown as Mock).mockImplementation(() =>
      createAdjustStore({ blockControllerMenuBlockIdx: null })
    );
    const { container } = render(<AdjustBlockDialog />);
    expect(container.firstChild).toBeNull();
  });

  it("shows split values while split is fixed", async () => {
    const { getByText, getAllByText } = renderOpenDialog();
    await userEvent.click(getByText("Split"));
    expect(getAllByText("4", { selector: "p" }).length).toBeGreaterThanOrEqual(2);
  });

  it("runs rows adjustment controls while rows is fixed", async () => {
    const store = createAdjustStore();
    (useStore as unknown as Mock).mockImplementation(() => store);
    const { getByText, getAllByText } = renderOpenDialog();
    await userEvent.click(getByText("Rows"));
    await userEvent.click(getByText("MIN"));
    await userEvent.click(getByText("-1"));
    await userEvent.click(getByText("+1"));
    await userEvent.click(getAllByText("/2")[0]);
    await userEvent.click(getAllByText("x2")[0]);
    await userEvent.click(getByText("MAX"));
    expect(store.adjustBlockDialogForm.split).toBe(128);
  });

  it("runs bpm adjustment controls while bpm is fixed", async () => {
    const store = createAdjustStore();
    (useStore as unknown as Mock).mockImplementation(() => store);
    const { getByText, getAllByText } = renderOpenDialog();
    await userEvent.click(getByText("BPM"));
    await userEvent.click(getByText("MIN"));
    await userEvent.click(getByText("-1"));
    await userEvent.click(getByText("+1"));
    await userEvent.click(getAllByText("/2")[1]);
    await userEvent.click(getAllByText("x2")[1]);
    await userEvent.click(getByText("MAX"));
    expect(store.adjustBlockDialogForm.split).toBe(128);
  });

  it("updates blocks and scales notes when rows change", async () => {
    const store = createAdjustStore();
    (useStore as unknown as Mock).mockImplementation(() => store);
    const { getByText, getAllByText } = renderOpenDialog();
    const x2 = getAllByText("x2").find(
      (element) => !(element as HTMLButtonElement).disabled
    )!;
    await userEvent.click(x2);
    await userEvent.click(getByText("Split"));
    await userEvent.click(getByText("BPM"));
    await userEvent.click(getByText("UPDATE"));

    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetIsProtected).toHaveBeenCalledWith(true);
    expect(mockPushUndoSnapshot).toHaveBeenCalled();
    expect(mockResetBlockControllerMenuBlockIdx).toHaveBeenCalled();
  });

  it("updates following blocks accumulated rows when first block rows change", async () => {
    const store = createAdjustStore();
    (useStore as unknown as Mock).mockImplementation(() => store);
    const { getByText, getAllByText } = renderOpenDialog();
    const x2 = getAllByText("x2").find(
      (element) => !(element as HTMLButtonElement).disabled
    )!;
    await userEvent.click(x2);
    await userEvent.click(getByText("Split"));
    await userEvent.click(getByText("BPM"));
    await userEvent.click(getByText("UPDATE"));

    const updatedBlocks = mockSetBlocks.mock.calls.at(-1)?.[0];
    expect(updatedBlocks[1].accumulatedRows).toBe(16);
  });

  it("closes dialog and resets menu block index", async () => {
    const { getByText } = renderOpenDialog();
    await userEvent.click(getByText("✕"));
    expect(mockResetBlockControllerMenuBlockIdx).toHaveBeenCalled();
    expect(mockResetAdjustBlockDialogForm).toHaveBeenCalled();
  });
});
