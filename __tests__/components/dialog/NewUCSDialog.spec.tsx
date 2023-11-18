import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecoilRoot, useSetRecoilState } from "recoil";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";
import { isOpenedNewUCSDialogState } from "../../../src/services/atoms";
import { Block, ChartSnapshot, Note } from "../../../src/types/ucs";

const waitForRerender = async () =>
  new Promise((resolve) => setTimeout(resolve, 0));

const mockSetBlocks = jest.fn();
const mockSetIsPerformance = jest.fn();
const mockSetIsProtected = jest.fn();
const mockSetNotes = jest.fn();
const mockSetRedoSnapshots = jest.fn();
const mockSetUcsName = jest.fn();
const mockSetUndoSnapshots = jest.fn();
jest.mock("recoil", () => ({
  ...jest.requireActual("recoil"),
  useSetRecoilState: jest.fn(),
}));

describe("NewUCSDialog", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Render invisibly if isOpenedNewUCSDialogState is false", () => {
    const { queryByRole } = render(
      <RecoilRoot>
        <NewUCSDialog />
      </RecoilRoot>
    );

    expect(queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Render visibly if isOpenedNewUCSDialogState is true", () => {
    const { getByLabelText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    expect(queryByRole("dialog")).toBeInTheDocument();
    expect(getByLabelText("UCS File Name")).toHaveValue("CS001");
    expect(getByLabelText("Mode")).toHaveTextContent("Single");
    expect(getByLabelText("BPM")).toHaveValue(120);
    expect(getByLabelText("Delay(ms)")).toHaveValue(0);
    expect(getByLabelText("Split")).toHaveValue(2);
    expect(getByLabelText("Beat")).toHaveValue(4);
    expect(getByLabelText("Rows")).toHaveValue(50);
  });

  it("Rerender all inputs changed different values", async () => {
    const { findByText, getByLabelText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    await userEvent.clear(getByLabelText("UCS File Name"));
    await userEvent.type(getByLabelText("UCS File Name"), "foo");
    await userEvent.click(getByLabelText("Mode"));
    await waitForRerender();
    await userEvent.click(await findByText("Double Performance"));
    await userEvent.clear(getByLabelText("BPM"));
    await userEvent.type(getByLabelText("BPM"), "123.4567");
    await userEvent.clear(getByLabelText("Delay(ms)"));
    await userEvent.type(getByLabelText("Delay(ms)"), "0.1234567");
    await userEvent.clear(getByLabelText("Split"));
    await userEvent.type(getByLabelText("Split"), "4");
    await userEvent.clear(getByLabelText("Beat"));
    await userEvent.type(getByLabelText("Beat"), "3");
    await userEvent.clear(getByLabelText("Rows"));
    await userEvent.type(getByLabelText("Rows"), "10");

    await waitForRerender();

    await waitFor(() => {
      expect(getByLabelText("UCS File Name")).toHaveValue("foo");
      expect(getByLabelText("Mode")).toHaveTextContent("Double Performance");
      expect(getByLabelText("BPM")).toHaveValue(123.4567);
      expect(getByLabelText("Delay(ms)")).toHaveValue(0.1234567);
      expect(getByLabelText("Split")).toHaveValue(4);
      expect(getByLabelText("Beat")).toHaveValue(3);
      expect(getByLabelText("Rows")).toHaveValue(10);
    });
  });

  it("Rerender invisibly if CANCEL button is clicked", async () => {
    const { getByText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    await userEvent.click(getByText("CANCEL"));

    await waitForRerender();

    await waitFor(() => expect(queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("Call Recoil setters and rerender invisibly if CREATE button is clicked with valid inputs", async () => {
    (useSetRecoilState as jest.Mock)
      .mockImplementationOnce(() => mockSetBlocks)
      .mockImplementationOnce(() => mockSetIsPerformance)
      .mockImplementationOnce(() => mockSetIsProtected)
      .mockImplementationOnce(() => mockSetNotes)
      .mockImplementationOnce(() => mockSetRedoSnapshots)
      .mockImplementationOnce(() => mockSetUcsName)
      .mockImplementationOnce(() => mockSetUndoSnapshots);

    const { getByText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    await userEvent.click(getByText("CREATE"));

    await waitForRerender();

    await waitFor(() => {
      expect(mockSetBlocks).toHaveBeenCalledWith<[Block[]]>([
        {
          accumulatedRows: 0,
          beat: 4,
          bpm: 120,
          delay: 0,
          rows: 50,
          split: 2,
        },
      ]);
      expect(mockSetIsPerformance).toHaveBeenCalledWith<[boolean]>(false);
      expect(mockSetIsProtected).toHaveBeenCalledWith<[boolean]>(false);
      expect(mockSetNotes).toHaveBeenCalledWith<[Note[][]]>([
        [],
        [],
        [],
        [],
        [],
      ]);
      expect(mockSetRedoSnapshots).toHaveBeenCalledWith<[ChartSnapshot[]]>([]);
      expect(mockSetUcsName).toHaveBeenCalledWith<[string]>("CS001.ucs");
      expect(mockSetUndoSnapshots).toHaveBeenCalledWith<[ChartSnapshot[]]>([]);
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("Rerender visibly with errors if CREATE button is clicked with invalid 6 inputs", async () => {
    const { getByLabelText, getByText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    await userEvent.clear(getByLabelText("UCS File Name"));
    await userEvent.clear(getByLabelText("BPM"));
    await userEvent.type(getByLabelText("BPM"), "1000");
    await userEvent.clear(getByLabelText("Delay(ms)"));
    await userEvent.type(getByLabelText("Delay(ms)"), "1234.5678");
    await userEvent.clear(getByLabelText("Split"));
    await userEvent.type(getByLabelText("Split"), "0");
    await userEvent.clear(getByLabelText("Beat"));
    await userEvent.type(getByLabelText("Beat"), "-1");
    await userEvent.clear(getByLabelText("Rows"));
    await userEvent.type(getByLabelText("Rows"), "10.5");
    await userEvent.click(getByText("CREATE"));

    await waitForRerender();

    await waitFor(() => {
      expect(queryByRole("dialog")).toBeInTheDocument();
      expect(getByLabelText("UCS File Name")).toHaveValue("");
      expect(getByLabelText("BPM")).toHaveValue(1000);
      expect(getByLabelText("Delay(ms)")).toHaveValue(1234.5678);
      expect(getByLabelText("Split")).toHaveValue(0);
      expect(getByLabelText("Beat")).toHaveValue(-1);
      expect(getByLabelText("Rows")).toHaveValue(10.5);
      expect(document.getElementsByClassName("Mui-error")).toHaveLength(6 * 3);
    });
  });
});
