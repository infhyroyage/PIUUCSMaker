import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetUcsName = vi.fn();
const mockSetIsPerformance = vi.fn();
const mockCloseNewUcsDialog = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useNewUcsDialog", () => ({
  default: () => ({ closeNewUcsDialog: mockCloseNewUcsDialog }),
}));

function renderOpenDialog() {
  const view = render(<NewUCSDialog />);
  view.getByTestId("new-ucs-dialog").showModal();
  return view;
}

describe("NewUCSDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: vi.fn(),
      setNotes: mockSetNotes,
      resetRedoSnapshots: vi.fn(),
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: vi.fn(),
    });
  });
  afterEach(() => cleanup());

  it("creates a new single chart with valid defaults", async () => {
    const { getByText } = renderOpenDialog();
    await userEvent.click(getByText("CREATE"));
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetUcsName).toHaveBeenCalledWith("CS001.ucs");
    expect(mockCloseNewUcsDialog).toHaveBeenCalled();
  });

  it("creates double performance chart when mode is selected", async () => {
    const { getByText, getByDisplayValue } = renderOpenDialog();
    await userEvent.selectOptions(
      getByDisplayValue("Single"),
      "DoublePerformance"
    );
    await userEvent.click(getByText("CREATE"));
    expect(mockSetIsPerformance).toHaveBeenCalledWith(true);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("creates single performance chart with five columns", async () => {
    const { getByText, getByDisplayValue } = renderOpenDialog();
    await userEvent.selectOptions(
      getByDisplayValue("Single"),
      "SinglePerformance"
    );
    await userEvent.click(getByText("CREATE"));
    expect(mockSetIsPerformance).toHaveBeenCalledWith(true);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("updates numeric fields through inputs", async () => {
    const { getByDisplayValue } = renderOpenDialog();
    const bpmInput = getByDisplayValue("120");
    await userEvent.clear(bpmInput);
    await userEvent.type(bpmInput, "140");
    expect(bpmInput).toHaveValue(140);
  });

  it("shows validation errors for invalid form", async () => {
    const { getByText, getByLabelText, getByDisplayValue } = renderOpenDialog();
    await userEvent.clear(getByLabelText("UCS File Name"));
    const bpmInput = getByDisplayValue("120");
    await userEvent.clear(bpmInput);
    await userEvent.type(bpmInput, "abc");
    await userEvent.click(getByText("CREATE"));
    expect(
      getByText("Number of 4th Beats per Minute(0.1 - 999)")
    ).toBeInTheDocument();
    expect(getByText("Not Set Extension(.ucs)")).toBeInTheDocument();
  });
});
