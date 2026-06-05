import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ReadyUCS from "../../../src/components/workspace/ReadyUCS";

const mockOpenNewUcsDialog = vi.fn();
const mockOnUploadUCS = vi.fn();

vi.mock("../../../src/hooks/useNewUcsDialog", () => ({
  default: () => ({ openNewUcsDialog: mockOpenNewUcsDialog }),
}));

vi.mock("../../../src/hooks/useUploadingUCS", () => ({
  default: () => ({ isUploadingUCS: false, onUploadUCS: mockOnUploadUCS }),
}));

describe("ReadyUCS", () => {
  beforeEach(() => vi.resetAllMocks());
  afterEach(() => cleanup());

  it("opens new UCS dialog when button is clicked", async () => {
    // Given: ready screen
    const { getByText } = render(<ReadyUCS />);

    // When: new UCS button is clicked
    await userEvent.click(getByText("New UCS"));

    // Then: dialog opener runs
    expect(mockOpenNewUcsDialog).toHaveBeenCalled();
  });

  it("shows upload label and accepts ucs files", () => {
    // Given: ready screen
    const { getByText, container } = render(<ReadyUCS />);

    // When: inspecting upload control
    const input = container.querySelector('input[type="file"]');

    // Then: upload label and accept attribute are correct
    expect(getByText("Upload UCS")).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".ucs");
  });
});
