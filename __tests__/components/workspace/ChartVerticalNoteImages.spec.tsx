import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ChartVerticalNoteImages from "../../../src/components/workspace/ChartVerticalNoteImages";
import { useStore } from "../../../src/hooks/useStore";

vi.mock("../../../src/hooks/useStore", () => ({
  useStore: vi.fn(),
}));

vi.mock("../../../src/hooks/useVerticalBorderSize", () => ({
  default: () => 4,
}));

describe("ChartVerticalNoteImages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useStore as unknown as Mock).mockReturnValue({
      noteSize: 40,
      zoom: { idx: 0, top: null },
    });
  });
  afterEach(() => cleanup());

  const baseProps = {
    accumulatedRows: 0,
    blockYDist: 0,
    column: 0,
    rowIdx: 0,
    split: 2,
  };

  it("renders single note image for type X", () => {
    // Given: single note
    const { getByAltText } = render(
      <ChartVerticalNoteImages {...baseProps} type="X" />
    );

    // When: querying image
    // Then: note asset is shown
    expect(getByAltText("note0")).toBeInTheDocument();
  });

  it("renders hold end images for type W", () => {
    // Given: hold end note
    const { getAllByRole } = render(
      <ChartVerticalNoteImages {...baseProps} type="W" />
    );

    // When: counting images
    // Then: hold tail and note head render
    expect(getAllByRole("img")).toHaveLength(2);
  });

  it("renders hold start images for type M", () => {
    // Given: hold start
    const { getAllByRole } = render(
      <ChartVerticalNoteImages {...baseProps} type="M" />
    );

    // When: counting images
    // Then: note and hold body images render
    expect(getAllByRole("img")).toHaveLength(2);
  });

  it("renders hold middle image for type H on another column", () => {
    const { getByAltText } = render(
      <ChartVerticalNoteImages {...baseProps} column={6} type="H" />
    );
    expect(getByAltText("hold1")).toBeInTheDocument();
  });

  it("prevents drag start on type X note image", () => {
    const { getByAltText } = render(
      <ChartVerticalNoteImages {...baseProps} type="X" />
    );
    const note = getByAltText("note0");
    const dragEvent = new Event("dragstart", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = vi.spyOn(dragEvent, "preventDefault");
    note.dispatchEvent(dragEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("prevents drag start on M hold and note images", () => {
    const { getAllByRole } = render(
      <ChartVerticalNoteImages {...baseProps} type="M" />
    );
    const images = getAllByRole("img");
    for (const image of images) {
      const dragEvent = new Event("dragstart", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefault = vi.spyOn(dragEvent, "preventDefault");
      image.dispatchEvent(dragEvent);
      expect(preventDefault).toHaveBeenCalled();
    }
  });

  it("prevents drag start on type W hold and note images", () => {
    const { getAllByRole } = render(
      <ChartVerticalNoteImages {...baseProps} type="W" />
    );
    const images = getAllByRole("img");
    for (const image of images) {
      const dragEvent = new Event("dragstart", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefault = vi.spyOn(dragEvent, "preventDefault");
      image.dispatchEvent(dragEvent);
      expect(preventDefault).toHaveBeenCalled();
    }
  });

  it("prevents drag start on type H hold image via react event", () => {
    const { getByAltText } = render(
      <ChartVerticalNoteImages {...baseProps} type="H" />
    );
    const hold = getByAltText("hold0");
    const dragEvent = new Event("dragstart", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = vi.spyOn(dragEvent, "preventDefault");
    hold.dispatchEvent(dragEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("prevents drag start on note images via native event", () => {
    // Given: rendered note
    const { getByAltText } = render(
      <ChartVerticalNoteImages {...baseProps} type="H" />
    );
    const dragEvent = new Event("dragstart", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = vi.spyOn(dragEvent, "preventDefault");

    // When: drag starts
    getByAltText("hold0").dispatchEvent(dragEvent);

    // Then: default is prevented
    expect(preventDefault).toHaveBeenCalled();
  });
});
