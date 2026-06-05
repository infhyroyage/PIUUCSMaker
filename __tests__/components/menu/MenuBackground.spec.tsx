import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MenuBackground from "../../../src/components/menu/MenuBackground";

describe("MenuBackground", () => {
  afterEach(() => cleanup());

  it("calls onClose on click", () => {
    // Given: overlay with close handler
    const onClose = vi.fn();
    const { container } = render(<MenuBackground onClose={onClose} />);

    // When: user clicks the overlay
    fireEvent.click(container.firstChild as Element);

    // Then: onClose is invoked once
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on context menu", () => {
    // Given: overlay with close handler
    const onClose = vi.fn();
    const { container } = render(<MenuBackground onClose={onClose} />);

    // When: user opens context menu on overlay
    fireEvent.contextMenu(container.firstChild as Element);

    // Then: onClose is invoked once
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
