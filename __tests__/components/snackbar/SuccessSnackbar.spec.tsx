import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import SuccessSnackbar from "../../../src/components/snackbar/SuccessSnackbar";
import { successMessageState } from "../../../src/services/atoms";
import userEvent from "@testing-library/user-event";

describe("SuccessSnackbar", () => {
  it("Render invisibly if successMessageState is empty", () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <SuccessSnackbar />
      </RecoilRoot>
    );

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Rerender visibly if successMessageState is not empty", async () => {
    const { getByText, rerender } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(successMessageState, "SuccessMessage");
        }}
      >
        <SuccessSnackbar />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <SuccessSnackbar />
      </RecoilRoot>
    );

    await waitFor(() =>
      expect(getByText("SuccessMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    const { findByTitle, queryByText, rerender } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(successMessageState, "SuccessMessage");
        }}
      >
        <SuccessSnackbar />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <SuccessSnackbar />
      </RecoilRoot>
    );

    await userEvent.click(await findByTitle("Close"));

    rerender(
      <RecoilRoot>
        <SuccessSnackbar />
      </RecoilRoot>
    );

    await waitFor(() =>
      expect(queryByText("SuccessMessage")).not.toBeInTheDocument()
    );
  });
});
