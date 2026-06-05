import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BlockController from "../../../src/components/workspace/BlockController";
import { useStore } from "../../../src/hooks/useStore";

const mockSetBlockControllerMenuBlockIdx = vi.fn();
const mockSetBlockControllerMenuPosition = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useVerticalBorderSize", () => ({
  default: () => 4,
}));

vi.mock("../../../src/components/workspace/BlockControllerButton", () => ({
  default: ({
    onClick,
  }: {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }) => (
    <button type="button" data-testid="block-controller-button" onClick={onClick}>
      Block
    </button>
  ),
}));

vi.mock("../../../src/components/menu/BlockControllerMenu", () => ({
  default: () => <div data-testid="block-controller-menu" />,
}));

describe("BlockController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      blocks: [
        { accumulatedRows: 0, beat: 4, bpm: 120, delay: 0, rows: 4, split: 2 },
      ],
      notes: [[], [], [], [], []],
      noteSize: 40,
      setBlockControllerMenuBlockIdx: mockSetBlockControllerMenuBlockIdx,
      setBlockControllerMenuPosition: mockSetBlockControllerMenuPosition,
    });
  });
  afterEach(() => cleanup());

  it("opens block menu at click coordinates", () => {
    // Given: rendered controller
    const { getByTestId } = render(<BlockController />);

    // When: block button is clicked
    fireEvent.click(getByTestId("block-controller-button"), {
      clientX: 10,
      clientY: 20,
    });

    // Then: menu position and index are stored
    expect(mockSetBlockControllerMenuBlockIdx).toHaveBeenCalledWith(0);
    expect(mockSetBlockControllerMenuPosition).toHaveBeenCalledWith({
      top: 20,
      left: 10,
    });
    expect(getByTestId("block-controller-menu")).toBeInTheDocument();
  });
});
