import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useEditBlockDialog from "../../src/hooks/useEditBlockDialog";

describe("useEditBlockDialog", () => {
  beforeEach(() => {
    document.body.innerHTML = '<dialog id="edit-block-dialog"></dialog>';
    const dialog = document.getElementById(
      "edit-block-dialog"
    ) as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens and closes the edit block dialog element", () => {
    // Given: dialog element in the document
    const dialog = document.getElementById(
      "edit-block-dialog"
    ) as HTMLDialogElement;
    const showModal = vi.spyOn(dialog, "showModal");
    const close = vi.spyOn(dialog, "close");

    // When: open and close are called
    const { result } = renderHook(useEditBlockDialog);
    act(() => result.current.openEditBlockDialog());
    act(() => result.current.closeEditBlockDialog());

    // Then: native dialog APIs are invoked
    expect(showModal).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });

  it("returns false when dialog element is missing", () => {
    // Given: no dialog in DOM
    document.body.innerHTML = "";

    // When: hook reads open state
    const { result } = renderHook(useEditBlockDialog);

    // Then: isOpened is false
    expect(result.current.isOpenedEditBlockDialog).toBe(false);
  });
});
