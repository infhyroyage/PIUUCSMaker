import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlocks = vi.fn();
const mockSetNotes = vi.fn();
const mockSetUcsName = vi.fn();
const mockCloseNewUcsDialog = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useNewUcsDialog", () => ({
  default: () => ({ closeNewUcsDialog: mockCloseNewUcsDialog }),
}));

describe("NewUCSDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: vi.fn(),
      setIsProtected: vi.fn(),
      setNotes: mockSetNotes,
      resetRedoSnapshots: vi.fn(),
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: vi.fn(),
    });
  });
  afterEach(() => cleanup());

  it("creates a new single chart with valid defaults", async () => {
    // Given: dialog with default form values
    const { getByText } = render(<NewUCSDialog />);

    // When: CREATE is clicked
    await userEvent.click(getByText("CREATE"));

    // Then: chart state is initialized
    expect(mockSetBlocks).toHaveBeenCalled();
    expect(mockSetNotes).toHaveBeenCalled();
    expect(mockSetUcsName).toHaveBeenCalledWith("CS001.ucs");
    expect(mockCloseNewUcsDialog).toHaveBeenCalled();
  });

  it("creates double performance chart when mode is selected", async () => {
    // Given: dialog rendered
    const mockSetIsPerformance = vi.fn();
    (useStore as unknown as Mock).mockReturnValue({
      setBlocks: mockSetBlocks,
      setIsPerformance: mockSetIsPerformance,
      setIsProtected: vi.fn(),
      setNotes: mockSetNotes,
      resetRedoSnapshots: vi.fn(),
      setUcsName: mockSetUcsName,
      resetUndoSnapshots: vi.fn(),
    });
    const { getByText, getByLabelText } = render(<NewUCSDialog />);

    // When: mode switched to double performance and created
    await userEvent.selectOptions(getByLabelText("Mode"), "DoublePerformance");
    await userEvent.click(getByText("CREATE"));

    // Then: performance flag is enabled for double chart
    expect(mockSetIsPerformance).toHaveBeenCalledWith(true);
    expect(mockSetNotes).toHaveBeenCalled();
  });

  it("shows validation errors for invalid form", async () => {
    // Given: dialog with invalid BPM
    const { getByText, getByDisplayValue } = render(<NewUCSDialog />);
    await userEvent.clear(getByDisplayValue("120"));
    await userEvent.type(getByDisplayValue(""), "abc");

    // When: CREATE is clicked
    await userEvent.click(getByText("CREATE"));

    // Then: BPM validation message appears
    expect(getByText(/BPM/)).toBeInTheDocument();
  });
});
