import { memo, useCallback, useState } from "react";
import {
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  PopoverPosition,
  Typography,
} from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chartIndicatorMenuPositionState,
  notesState,
  selectorState,
} from "../../service/atoms";
import { ChartIndicatorMenuProps } from "../../types/props";
import { ClipBoard, CopiedNote, Note, Selector } from "../../types/chart";

function ChartIndicatorMenu({ handler, indicator }: ChartIndicatorMenuProps) {
  const [clipBoard, setClipBoard] = useState<ClipBoard>(null);
  const [menuPosition, setMenuPosition] = useRecoilState<
    PopoverPosition | undefined
  >(chartIndicatorMenuPositionState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const selector = useRecoilValue<Selector>(selectorState);

  const updateClipBoard = (
    startColumn: number,
    goalColumn: number,
    startRowIdx: number,
    goalRowIdx: number
  ) => {
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
  };

  const onClickCut = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return;

    // 選択領域の始点/終点の列インデックス/譜面全体での行インデックスをそれぞれ取得
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

    updateClipBoard(startColumn, goalColumn, startRowIdx, goalRowIdx);

    // 選択領域に含まれる領域のみ、単ノート/ホールドの始点/ホールドの中間/ホールドの終点のカット対象とする
    setNotes(
      notes.map((ns: Note[], column: number) =>
        column < startColumn || column > goalColumn
          ? ns
          : [
              ...ns.filter(
                (note: Note) => note.idx < startRowIdx || note.idx > goalRowIdx
              ),
            ]
      )
    );

    setMenuPosition(undefined);
  }, [notes, selector.completedCords, setClipBoard, setMenuPosition]);

  const onClickCopy = useCallback(() => {
    // 選択領域が非表示/入力中の場合はNOP
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return;

    // 選択領域の始点/終点の列インデックス/譜面全体での行インデックスをそれぞれ取得
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

    updateClipBoard(startColumn, goalColumn, startRowIdx, goalRowIdx);
    setMenuPosition(undefined);
  }, [notes, selector.completedCords, setClipBoard, setMenuPosition]);

  const onClickPaste = useCallback(() => {
    // インディケーターが非表示である/1度もコピーしていない場合はNOP
    if (indicator === null || clipBoard === null) return;

    // インディケーターの位置を左上としたコピー時の選択領域に含まれる領域のみ、
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

    setMenuPosition(undefined);
  }, [clipBoard, indicator, notes, setNotes, setMenuPosition]);

  return (
    <Menu
      anchorReference={menuPosition && "anchorPosition"}
      anchorPosition={menuPosition}
      disableRestoreFocus
      onClose={() => setMenuPosition(undefined)}
      open={!!menuPosition}
      slotProps={{
        root: {
          onMouseUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            event.stopPropagation(),
        },
        paper: { sx: { minWidth: 200 } },
      }}
    >
      <MenuList dense>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={onClickCut}
        >
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+X
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={onClickCopy}
        >
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+C
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={indicator === null || clipBoard === null}
          onClick={onClickPaste}
        >
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Ctrl+V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          <ListItemText>Flip Horizontal</ListItemText>
          <Typography variant="body2" color="text.secondary">
            X
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          <ListItemText>Flip Vertical</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Y
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          <ListItemText>Mirror</ListItemText>
          <Typography variant="body2" color="text.secondary">
            M
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={
            selector.completedCords === null ||
            selector.completedCords.mouseUpColumn === null ||
            selector.completedCords.mouseUpRowIdx === null
          }
          onClick={() => alert("TODO")}
        >
          <ListItemText>Delete</ListItemText>
          <Typography variant="body2" color="text.secondary">
            Delete
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={
            indicator !== null &&
            (indicator.rowIdx === indicator.blockAccumulatedLength ||
              indicator.mouseDownColumn !== null ||
              indicator.mouseDownRowIdx !== null ||
              indicator.mouseDownTop !== null)
          }
          onClick={() => {
            handler.split(indicator);
            setMenuPosition(undefined);
          }}
        >
          Split Block
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default memo(ChartIndicatorMenu);
