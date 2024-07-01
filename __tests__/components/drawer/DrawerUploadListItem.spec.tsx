import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DrawerUploadListItem from "../../../src/components/drawer/DrawerUploadListItem";
import { isOpenedDrawerState } from "../../../src/services/atoms";

const mockOnClick = vi.fn();

describe("DrawerUploadListItem", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render correctly if Drawer is closed", () => {
    const props = {
      disabled: false,
      extension: ".txt",
      icon: <div />,
      id: "test-id",
      label: "Test Label",
      onChange: mockOnClick,
    };

    const { getByRole } = render(
      <RecoilRoot>
        <DrawerUploadListItem {...props} />
      </RecoilRoot>
    );

    const button = getByRole("button");
    expect(button).toHaveStyle({ "justify-content": "center" });
    expect(button.children.length).toBe(3);
    expect(button.children[1]).toHaveStyle({ "margin-right": "auto" });
  });

  it("Render correctly if Drawer is opened", () => {
    const props = {
      disabled: false,
      extension: ".txt",
      icon: <div />,
      id: "test-id",
      label: "Test Label",
      onChange: mockOnClick,
    };

    const { getByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedDrawerState, true);
        }}
      >
        <DrawerUploadListItem {...props} />
      </RecoilRoot>
    );

    const button = getByRole("button");
    expect(button).toHaveStyle({ "justify-content": "initial" });
    expect(button.children.length).toBe(4);
    expect(button.children[1]).not.toHaveStyle({ "margin-right": "auto" });
  });
});
