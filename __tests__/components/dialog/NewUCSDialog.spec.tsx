import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import NewUCSDialog from "../../../src/components/dialog/NewUCSDialog";
import { isOpenedNewUCSDialogState } from "../../../src/services/atoms";
import { Block, ChartSnapshot, Note } from "../../../src/types/ucs";
import userEvent from "@testing-library/user-event";

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
    const { getByLabelText } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    fireEvent.change(getByLabelText("UCS File Name"), {
      target: { value: "foo" },
    });
    await userEvent.click(getByLabelText("Mode"));
    const item = await screen.findByText("Double Performance");
    await userEvent.click(item);
    fireEvent.change(getByLabelText("BPM"), {
      target: { value: "123.4567" },
    });
    fireEvent.change(getByLabelText("Delay(ms)"), {
      target: { value: "0.1234567" },
    });
    fireEvent.change(getByLabelText("Split"), {
      target: { value: "4" },
    });
    fireEvent.change(getByLabelText("Beat"), {
      target: { value: "3" },
    });
    fireEvent.change(getByLabelText("Rows"), {
      target: { value: "10" },
    });

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

  it("Render invisibly if CANCEL button is clicked", async () => {
    const { getByText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    fireEvent.click(getByText("CANCEL"));

    await waitFor(() => expect(queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("Call Recoil setters and render invisibly if CREATE button is clicked with valid inputs", async () => {
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

    fireEvent.click(getByText("CREATE"));

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

  it("Render visibly with errors if CREATE button is clicked with invalid 6 inputs", async () => {
    const { getByLabelText, getByText, queryByRole } = render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(isOpenedNewUCSDialogState, true);
        }}
      >
        <NewUCSDialog />
      </RecoilRoot>
    );

    fireEvent.change(getByLabelText("UCS File Name"), {
      target: { value: "" },
    });
    fireEvent.change(getByLabelText("BPM"), {
      target: { value: "1000" },
    });
    fireEvent.change(getByLabelText("Delay(ms)"), {
      target: { value: "" },
    });
    fireEvent.change(getByLabelText("Split"), {
      target: { value: "0" },
    });
    fireEvent.change(getByLabelText("Beat"), {
      target: { value: "-1" },
    });
    fireEvent.change(getByLabelText("Rows"), {
      target: { value: "10.5" },
    });
    fireEvent.click(getByText("CREATE"));

    await waitFor(() => {
      expect(queryByRole("dialog")).toBeInTheDocument();
      expect(getByLabelText("UCS File Name")).toHaveValue("");
      expect(getByLabelText("BPM")).toHaveValue(1000);
      expect(getByLabelText("Delay(ms)")).toHaveValue(null);
      expect(getByLabelText("Split")).toHaveValue(0);
      expect(getByLabelText("Beat")).toHaveValue(-1);
      expect(getByLabelText("Rows")).toHaveValue(10.5);
      expect(document.getElementsByClassName("Mui-error")).toHaveLength(6 * 3);
    });
  });
});
