import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useNewUcsDialog from "../../src/hooks/useNewUcsDialog";

describe("useNewUcsDialog", () => {
  beforeEach(() => {
    document.body.innerHTML = '<dialog id="new-ucs-dialog"></dialog>';
    const dialog = document.getElementById("new-ucs-dialog") as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens and closes the new UCS dialog element", () => {
    // Given: dialog element in the document
    const dialog = document.getElementById(
      "new-ucs-dialog"
    ) as HTMLDialogElement;
    const showModal = vi.spyOn(dialog, "showModal");
    const close = vi.spyOn(dialog, "close");

    // When: open and close are called
    const { result } = renderHook(useNewUcsDialog);
    act(() => result.current.openNewUcsDialog());
    act(() => result.current.closeNewUcsDialog());

    // Then: native dialog APIs are invoked
    expect(showModal).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });

  it("returns false when dialog element is missing", () => {
    // Given: no dialog in DOM
    document.body.innerHTML = "";

    // When: hook reads open state
    const { result } = renderHook(useNewUcsDialog);

    // Then: isOpened is false
    expect(result.current.isOpenedNewUCSDialog).toBe(false);
  });
});
