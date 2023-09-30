import { memo, useCallback, useState } from "react";
import {
  Divider,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
} from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chartIndicatorMenuPositionState,
  notesState,
  selectorState,
  successMessageState,
} from "../../service/atoms";
import { ChartIndicatorMenuProps } from "../../types/props";
import { ClipBoard, CopiedNote, Note, Selector } from "../../types/chart";

function ChartIndicatorMenu({ handler, indicator }: ChartIndicatorMenuProps) {
  const [clipBoard, setClipBoard] = useState<ClipBoard>(null);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [position, setPosition] = useRecoilState<PopoverPosition | undefined>(
    chartIndicatorMenuPositionState
  );
  const selector = useRecoilValue<Selector>(selectorState);
  const setSuccessMessage = useSetRecoilState<string>(successMessageState);

  const onCloseMenu = useCallback(() => setPosition(undefined), [setPosition]);

  const onClickCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return;

    // 選択領域の座標から、始点/終点の列インデックス/譜面全体での行インデックスをそれぞれ取得
    const startColumn: number = Math.min(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const goalColumn: number = Math.max(
      selector.completedCords.mouseDownColumn,
      selector.completedCords.mouseUpColumn
    );
    const startRowIdx: number = Math.min(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );
    const goalRowIdx: number = Math.max(
      selector.completedCords.mouseDownRowIdx,
      selector.completedCords.mouseUpRowIdx
    );

    setClipBoard({
      columnLength: goalColumn + 1 - startColumn,
      copiedNotes: [...Array(goalColumn - startColumn + 1)]
        .map((_, deltaColumn: number) =>
          notes[startColumn + deltaColumn]
            .filter(
              (note: Note) => note.idx >= startRowIdx && note.idx <= goalRowIdx
            )
            .map((note: Note) => {
              return {
                deltaColumn,
                deltaRowIdx: note.idx - startRowIdx,
                type: note.type,
              };
            })
        )
        .flat(),
      rowLength: goalRowIdx + 1 - startRowIdx,
    });
    setSuccessMessage("コピーしました");
    setPosition(undefined);
  }, [
    notes,
    selector.completedCords,
    setClipBoard,
    setSuccessMessage,
    setPosition,
  ]);

  const onClickPaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // インディケーターを左上として、コピー時の選択領域に含まれない列・行のみ
    // 単ノート/ホールドの始点/ホールドの中間/ホールドの終点のペースト対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < indicator.column ||
        column > indicator.column + clipBoard.columnLength - 1
          ? ns
          : [
              ...ns.filter((note: Note) => note.idx < indicator.rowIdx),
              ...clipBoard.copiedNotes
                .filter(
                  (copiedNote: CopiedNote) =>
                    copiedNote.deltaColumn === column - indicator.column
                )
                .map((copiedNote: CopiedNote) => {
                  return {
                    idx: indicator.rowIdx + copiedNote.deltaRowIdx,
                    type: copiedNote.type,
                  };
                }),
              ...ns.filter(
                (note: Note) =>
                  note.idx > indicator.rowIdx + clipBoard.rowLength - 1
              ),
            ]
      )
    );
    setPosition(undefined);
  }, [clipBoard, indicator, notes, setNotes, setPosition]);

  return (
    <Menu
      anchorReference={position && "anchorPosition"}
      anchorPosition={position}
      disableRestoreFocus
      onClose={onCloseMenu}
      open={!!position}
      slotProps={{
        root: {
          onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            event.stopPropagation(),
        },
      }}
    >
      <MenuList dense>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          Cut
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={onClickCopy}
        >
          Copy
        </MenuItem>
        <MenuItem onClick={onClickPaste}>Paste</MenuItem>
        <Divider />
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          Flip Horizontal
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          Flip Vertical
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          Mirror
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator !== null &&
            indicator.rowIdx === indicator.blockAccumulatedLength
          }
          onClick={() => {
            handler.split(indicator);
            setPosition(undefined);
          }}
        >
          Split Block
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(ChartIndicatorMenu);
