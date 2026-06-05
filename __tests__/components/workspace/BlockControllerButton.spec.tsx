import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import BlockControllerButton from "../../../src/components/workspace/BlockControllerButton";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/workspace/BorderLine", () => ({
  default: () => <div data-testid="border-line" />,
}));

describe("BlockControllerButton", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      noteSize: 40,
      zoom: { idx: 0, top: null },
    });
  });
  afterEach(() => cleanup());

  it("shows warning styling for ignored delay on non-first blocks", () => {
    // Given: non-first block with delay
    const { getByText } = render(
      <BlockControllerButton
        bpm={120}
        delay={100}
        isFirstBlock={false}
        isLastBlock={true}
        onClick={() => {}}
        rows={4}
        split={2}
      />
    );

    // When: reading delay label
    // Then: warning marker is shown
    expect(getByText(/Delay: 100/)).toHaveClass("text-warning");
  });

  it("invokes onClick when button is pressed", async () => {
    // Given: clickable block button
    const onClick = vi.fn();
    const { getByRole } = render(
      <BlockControllerButton
        bpm={120}
        delay={0}
        isFirstBlock={true}
        isLastBlock={false}
        onClick={onClick}
        rows={4}
        split={2}
      />
    );

    // When: user clicks
    await userEvent.click(getByRole("button"));

    // Then: handler runs
    expect(onClick).toHaveBeenCalled();
  });
});
