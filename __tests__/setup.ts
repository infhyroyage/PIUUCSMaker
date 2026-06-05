import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-color-scheme: dark)" ? false : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

HTMLDialogElement.prototype.showModal =
  HTMLDialogElement.prototype.showModal ||
  function showModal(this: HTMLDialogElement) {
    this.open = true;
  };

HTMLDialogElement.prototype.close =
  HTMLDialogElement.prototype.close ||
  function close(this: HTMLDialogElement) {
    this.open = false;
  };
