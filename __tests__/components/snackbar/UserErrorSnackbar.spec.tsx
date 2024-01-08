import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import UserErrorSnackbar from "../../../src/components/snackbar/UserErrorSnackbar";
import userEvent from "@testing-library/user-event";
import { userErrorMessageState } from "../../../src/services/atoms";

describe("UserErrorSnackbar", () => {
  it("Render invisibly if userErrorMessageState is empty", () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Rerender visibly if userErrorMessageState is not empty", async () => {
    const { getByText, rerender } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(userErrorMessageState, "UserErrorMessage");
        }}
      >
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await waitFor(() =>
      expect(getByText("UserErrorMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    const { findByTitle, queryByText, rerender } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(userErrorMessageState, "UserErrorMessage");
        }}
      >
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    rerender(
      <RecoilRoot>
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await userEvent.click(await findByTitle("Close"));

    rerender(
      <RecoilRoot>
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await waitFor(() =>
      expect(queryByText("UserErrorMessage")).not.toBeInTheDocument()
    );
  });
});
