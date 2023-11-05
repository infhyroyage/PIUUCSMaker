import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";
import { isOpenedNewUCSDialogState } from "../../../src/services/atoms";

describe("NewUCSDialog", () => {
  it("Render Correctly", async () => {
    const { getByText, getByLabelText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          // ダイアログを初期表示する
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    expect(getByText("New UCS")).toBeInTheDocument();
    expect(getByLabelText("UCS File Name")).toHaveValue("CS001");
    expect(getByLabelText("Mode")).toHaveTextContent("Single");
    expect(getByLabelText("BPM")).toHaveValue(120);
    expect(getByLabelText("Delay(ms)")).toHaveValue(0);
    expect(getByLabelText("Split")).toHaveValue(2);
    expect(getByLabelText("Beat")).toHaveValue(4);
    expect(getByLabelText("Rows")).toHaveValue(50);
    expect(getByText("CANCEL")).toBeInTheDocument();
    expect(getByText("CREATE")).toBeInTheDocument();
  });
});
