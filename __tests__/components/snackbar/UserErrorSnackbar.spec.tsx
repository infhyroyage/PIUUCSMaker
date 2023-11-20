import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import UserErrorSnackbar from "../../../src/components/snackbar/UserErrorSnackbar";
import userEvent from "@testing-library/user-event";
import { userErrorMessageState } from "../../../src/services/atoms";

const waitForRerender = async () =>
  new Promise((resolve) => setTimeout(resolve, 0));

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
    const { getByText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(userErrorMessageState, "UserErrorMessage");
        }}
      >
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await waitForRerender();

    await waitFor(() =>
      expect(getByText("UserErrorMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    const { findByTitle, queryByText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(userErrorMessageState, "UserErrorMessage");
        }}
      >
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await waitForRerender();

    await userEvent.click(await findByTitle("Close"));

    await waitForRerender();

    await waitFor(() =>
      expect(queryByText("UserErrorMessage")).not.toBeInTheDocument()
    );
  });
});
