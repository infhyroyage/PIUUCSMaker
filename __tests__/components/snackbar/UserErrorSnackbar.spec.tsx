import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecoilRoot } from "recoil";
import { afterEach, describe, expect, it } from "vitest";
import UserErrorSnackbar from "../../../src/components/snackbar/UserErrorSnackbar";
import { userErrorMessageState } from "../../../src/services/atoms";

describe("UserErrorSnackbar", () => {
  // https://github.com/vitest-dev/vitest/issues/1430
  afterEach(() => cleanup());

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

    await waitFor(() =>
      expect(getByText("UserErrorMessage")).toBeInTheDocument()
    );
  });

  it("Rerender invisibly if close button is clicked", async () => {
    const { findByTestId, queryByText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(userErrorMessageState, "UserErrorMessage");
        }}
      >
        <UserErrorSnackbar />
      </RecoilRoot>
    );

    await userEvent.click(await findByTestId("user-error-snackbar-close"));

    await waitFor(() =>
      expect(queryByText("UserErrorMessage")).not.toBeInTheDocument()
    );
  });
});
