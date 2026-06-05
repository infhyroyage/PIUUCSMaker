import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import WorkSpace from "../../../src/components/workspace/WorkSpace";
import { useStore } from "../../../src/hooks/useStore";

const mockResetHoldSetter = vi.fn();
const mockResizeNoteSizeWithWindow = vi.fn();
const mockHideSelector = vi.fn();

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/components/workspace/Identifier", () => ({
  default: () => <div data-testid="identifier" />,
}));

vi.mock("../../../src/components/workspace/Chart", () => ({
  default: () => <div data-testid="chart" />,
}));

vi.mock("../../../src/components/workspace/BlockController", () => ({
  default: () => <div data-testid="block-controller" />,
}));

describe("WorkSpace", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      resetHoldSetter: mockResetHoldSetter,
      resizeNoteSizeWithWindow: mockResizeNoteSizeWithWindow,
      hideSelector: mockHideSelector,
    });
  });
  afterEach(() => cleanup());

  it("registers resize listener and initializes note size", () => {
    // Given: workspace mount
    const addSpy = vi.spyOn(window, "addEventListener");

    // When: component renders
    render(<WorkSpace />);

    // Then: resize handler is registered and called once
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(mockResizeNoteSizeWithWindow).toHaveBeenCalled();
    addSpy.mockRestore();
  });

  it("resets hold setter and selector on escape key", () => {
    // Given: mounted workspace
    render(<WorkSpace />);

    // When: escape is pressed
    fireEvent.keyDown(window, { key: "Escape" });

    // Then: hold and selector reset
    expect(mockResetHoldSetter).toHaveBeenCalled();
    expect(mockHideSelector).toHaveBeenCalled();
  });

  it("resets hold setter on left mouse up", () => {
    // Given: mounted workspace
    const { container } = render(<WorkSpace />);

    // When: left mouse button is released
    fireEvent.mouseUp(container.firstChild as Element, { button: 0 });

    // Then: hold and selector reset
    expect(mockResetHoldSetter).toHaveBeenCalled();
    expect(mockHideSelector).toHaveBeenCalled();
  });
});
