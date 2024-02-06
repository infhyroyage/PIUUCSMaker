import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import MenuDrawerUploadListItem from "../../../src/components/menu/MenuDrawerUploadListItem";
import { isOpenedMenuDrawerState } from "../../../src/services/atoms";

const mockOnClick = vi.fn();

describe("MenuDrawerUploadListItem", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

  it("Render correctly if MenuDrawer is closed", () => {
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
        <MenuDrawerUploadListItem {...props} />
      </RecoilRoot>
    );

    const button = getByRole("button");
    expect(button).toHaveStyle({ "justify-content": "center" });
    expect(button.children.length).toBe(3);
    expect(button.children[1]).toHaveStyle({ "margin-right": "auto" });
  });

  it("Render correctly if MenuDrawer is opened", () => {
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
          set(isOpenedMenuDrawerState, true);
        }}
      >
        <MenuDrawerUploadListItem {...props} />
      </RecoilRoot>
    );

    const button = getByRole("button");
    expect(button).toHaveStyle({ "justify-content": "initial" });
    expect(button.children.length).toBe(4);
    expect(button.children[1]).not.toHaveStyle({ "margin-right": "auto" });
  });
});
