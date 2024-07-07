import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { describe, expect, it } from "vitest";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";

describe("NewUCSDialog", () => {
  it("Render invisibl by default", () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <NewUCSDialog />
      </RecoilRoot>
    );

    const dialog: HTMLDialogElement = getByTestId(
      "new-ucs-dialog"
    ) as HTMLDialogElement;
    expect(dialog.open).toBeFalsy();
  });
});
