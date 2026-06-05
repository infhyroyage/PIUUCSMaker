import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DrawerUploadListItem from "../../../src/components/drawer/DrawerUploadListItem";

describe("DrawerUploadListItem", () => {
  afterEach(() => cleanup());

  it("forwards file selection to onChange", () => {
    // Given: upload list item with hidden input
    const onChange = vi.fn();
    const { container } = render(
      <DrawerUploadListItem
        disabled={false}
        extension=".ucs"
        icon={<span />}
        id="upload-ucs"
        label="Upload"
        onChange={onChange}
      />
    );
    const input = container.querySelector("#upload-ucs") as HTMLInputElement;

    // When: file input changes
    fireEvent.change(input, { target: { files: [] } });

    // Then: onChange handler is called
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveAttribute("accept", ".ucs");
  });

  it("disables input when disabled is true", () => {
    // Given: disabled upload item
    const { container } = render(
      <DrawerUploadListItem
        disabled={true}
        extension=".mp3"
        icon={<span />}
        id="upload-mp3"
        label="MP3"
        onChange={() => {}}
      />
    );

    // When: inspecting input
    // Then: input is disabled
    expect(container.querySelector("#upload-mp3")).toBeDisabled();
  });
});
