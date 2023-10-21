import React, { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  blocksState,
  chartIndicatorMenuPositionState,
  columnsState,
  indicatorState,
  isPlayingState,
  isProtectedState,
  holdSetterState,
  noteSizeState,
  notesState,
  redoSnapshotsState,
  selectorState,
  undoSnapshotsState,
  zoomState,
} from "../../service/atoms";
import BorderLine from "./BorderLine";
import ChartVertical from "./ChartVertical";
import { Block, Note } from "../../types/ucs";
import { HoldSetter } from "../../types/chart";
import { ChartIndicatorMenuPosition, Zoom } from "../../types/menu";
import { ChartSnapshot } from "../../types/ucs";
import { Selector } from "../../types/chart";
import { Indicator } from "../../types/chart";
import { ZOOM_VALUES } from "../../service/zoom";
import ChartIndicator from "./ChartIndicator";
import ChartIndicatorMenu from "../menu/ChartIndicatorMenu";
import ChartSelector from "./ChartSelector";

function Chart() {
  const [blocks, setBlocks] = useRecoilState<Block[]>(blocksState);
  const [indicator, setIndicator] = useRecoilState<Indicator>(indicatorState);
  const [holdSetter, setHoldSetter] =
    useRecoilState<HoldSetter>(holdSetterState);
  const [notes, setNotes] = useRecoilState<Note[][]>(notesState);
  const [position, setPosition] = useRecoilState<ChartIndicatorMenuPosition>(
    chartIndicatorMenuPositionState
  );
  const [selector, setSelector] = useRecoilState<Selector>(selectorState);
  const [undoSnapshots, setUndoSnapshots] =
    useRecoilState<ChartSnapshot[]>(undoSnapshotsState);
  const columns = useRecoilValue<5 | 10>(columnsState);
  const isPlaying = useRecoilValue<boolean>(isPlayingState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);
  const setIsProtected = useSetRecoilState<boolean>(isProtectedState);
  const setRedoShapshots =
    useSetRecoilState<ChartSnapshot[]>(redoSnapshotsState);

  // 各譜面のブロックを設置するトップバーからのy座標の距離(px)を計算
  const blockYDists: number[] = useMemo(
    () =>
      [...Array(blocks.length)].reduce(
        (prev: number[], _, blockIdx: number) =>
          blockIdx === 0
            ? [0]
            : [
                ...prev,
                prev[blockIdx - 1] +
                  (2.0 *
                    noteSize *
                    ZOOM_VALUES[zoom.idx] *
                    blocks[blockIdx - 1].rows) /
                    blocks[blockIdx - 1].split,
              ],
        []
      ),
    [blocks, noteSize, zoom.idx]
  );

  // 縦の枠線のサイズ(px)をnoteSizeの0.05倍(偶数に丸めるように切り捨て、最小値は2)として計算
  const verticalBorderSize = useMemo(
    () => Math.max(Math.floor(noteSize * 0.025) * 2, 2),
    [noteSize]
  );

  const handleMouseMove = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    column: number
  ) => {
    // ChartIndicatorMenu表示中/再生中の場合はNOP
    if (!!position || isPlaying) return;

    // マウスホバーしたy座標を取得
    const y: number = Math.floor(
      event.clientY - event.currentTarget.getBoundingClientRect().top
    );

    // マウスホバーした譜面全体の行インデックスの場所から、マウスのブラウザの画面のy座標、
    // 行インデックス、譜面のブロックのインデックスをすべて取得
    // 譜面のブロックのマウスホバーが外れた場合、前者2つはともにnullとする
    let top: number | null = null;
    let rowIdx: number | null = null;
    const blockIdx: number = blocks.findIndex((block: Block, idx: number) => {
      // 譜面のブロックの1行あたりの高さ(px)
      const unitRowHeight: number =
        (2.0 * noteSize * ZOOM_VALUES[zoom.idx]) / block.split;
      // 譜面のブロックの高さ(px)
      const blockHeight: number = unitRowHeight * block.rows;
      if (y < blockYDists[idx] + blockHeight) {
        top = y - ((y - blockYDists[idx]) % unitRowHeight);
        // (top - blockYDists[blockIdx])は必ずunitRowHeightの倍数であるため、
        // ((top - blockYDists[blockIdx]) / unitRowHeight)は理論上整数値となるが、
        // 除算時の丸め誤差を取り除くべくMath.floor関数を実行し、rowIdxに必ず整数値を設定する
        rowIdx =
          block.accumulatedRows +
          Math.floor((top - blockYDists[idx]) / unitRowHeight);
        return true;
      }
      return false;
    });

    // 無駄な再レンダリングを避けるため、マウスホバーした場所の列インデックス・譜面全体での行のインデックスが
    // 現在のインディケーターの列インデックス・譜面全体での行のインデックスとすべて同じである場合、indicatorの状態を更新しない
    if (
      (indicator !== null || (top !== null && rowIdx !== null)) &&
      (indicator === null ||
        top === null ||
        rowIdx === null ||
        indicator.column !== column ||
        indicator.rowIdx !== rowIdx)
    ) {
      setIndicator(
        top !== null && rowIdx !== null
          ? {
              blockAccumulatedRows: blocks[blockIdx].accumulatedRows,
              blockIdx,
              column,
              rowIdx,
              top,
            }
          : null
      );
    }

    if (
      selector.setting !== null &&
      (column !== selector.setting.mouseUpColumn ||
        rowIdx !== selector.setting.mouseUpRowIdx)
    ) {
      // 選択領域入力時の場合は、入力時の選択領域のみパラメーターを更新
      setSelector({
        setting: {
          ...selector.setting,
          mouseUpColumn: column,
          mouseUpRowIdx: rowIdx,
        },
        completed: null,
      });
    } else if (
      !event.shiftKey &&
      selector.setting !== null &&
      !selector.setting.isSettingByMenu
    ) {
      // Shift未入力、かつ、「Start Selecting」を選択せずに入力時の選択領域を表示している場合は、選択領域を非表示
      setSelector({ setting: null, completed: null });
    }
  };

  const onMouseLeave = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // ChartIndicatorMenu表示中/再生中/の場合はNOP
    if (!!position || isPlaying) return;

    // インディケーターを非表示
    setIndicator(null);

    // 選択領域入力時の場合は、入力時の選択領域のみパラメーターを更新
    // ただし、Shift未入力、かつ、「Start Selecting」を選択せずに入力時の選択領域を表示している場合は、選択領域を非表示
    if (selector.setting !== null) {
      setSelector({
        setting:
          !event.shiftKey && !selector.setting.isSettingByMenu
            ? null
            : {
                ...selector.setting,
                mouseUpColumn: null,
                mouseUpRowIdx: null,
              },
        completed: null,
      });
    }
  };

  const onMouseDown = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // 左クリック以外/ChartIndicatorMenu表示中/再生中/押下した瞬間にインディケーターが非表示の場合はNOP
    if (event.button !== 0 || !!position || isPlaying || indicator === null)
      return;

    // Shift未入力の場合のみ、ホールド設置中の表示パラメーターを更新
    if (!event.shiftKey && holdSetter === null) {
      setHoldSetter({
        column: indicator.column,
        isSettingByMenu: false,
        rowIdx: indicator.rowIdx,
        top: indicator.top,
      });
    }

    if (event.shiftKey && selector.setting === null) {
      // Shift入力時、かつ、選択領域入力時ではない場合は、入力時の選択領域のみパラメーターを設定
      setSelector({
        setting: {
          isSettingByMenu: false,
          mouseDownColumn: indicator.column,
          mouseDownRowIdx: indicator.rowIdx,
          mouseUpColumn: indicator.column,
          mouseUpRowIdx: indicator.rowIdx,
        },
        completed: null,
      });
    } else if (
      !event.shiftKey &&
      ((selector.setting !== null && !selector.setting.isSettingByMenu) ||
        selector.completed !== null)
    ) {
      // Shift未入力、かつ、「Start Selecting」を選択せずに選択領域を表示している場合は、選択領域を非表示
      setSelector({ setting: null, completed: null });
    }
  };

  const onMouseUp = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    // 左クリック以外/ChartIndicatorMenu表示中/再生中/別々の列を跨いだマウス操作の場合はNOP
    if (event.button !== 0 || !!position || isPlaying) return;

    // 親コンポーネントのWorkspaceに設定したonMouseUpへ伝搬しない
    event.stopPropagation();

    // 同一列内でのクリック操作時、かつ、選択領域入力時でない場合のみ、単ノート/ホールドの設置・削除を行う
    if (
      indicator !== null &&
      holdSetter !== null &&
      indicator.column === holdSetter.column &&
      selector.setting === null
    ) {
      // 単ノート/ホールドの始点start、終点goalの譜面全体での行インデックスを取得
      const start: number = Math.min(indicator.rowIdx, holdSetter.rowIdx);
      const goal: number = Math.max(indicator.rowIdx, holdSetter.rowIdx);

      // 譜面全体での行インデックスmouseDown.rowIdxで押下した後に
      // 譜面全体での行インデックスindicator.rowIdxで押下を離した際の
      // 列インデックスindicator.columnにて、単ノート/ホールドの追加・削除を行う
      let updatedNotes: Note[];
      if (start === goal) {
        const foundNote: Note | undefined = notes[indicator.column].find(
          (note: Note) => note.rowIdx === start
        );
        if (foundNote && foundNote.type === "X") {
          // startの場所に存在する単ノートを削除(単ノートは新規追加しない)
          updatedNotes = notes[indicator.column].filter(
            (note: Note) => note.rowIdx !== start
          );
        } else if (foundNote) {
          // startの場所に属するホールド(M/H/W)を削除(単ノートは新規追加しない)
          let beforeNotes: Note[] = notes[indicator.column].filter(
            (note: Note) => note.rowIdx < start
          );
          const foundBeforeNote: Note | undefined = [...beforeNotes]
            .reverse()
            .find((note: Note) => ["X", "M", "W"].includes(note.type));
          if (foundBeforeNote) {
            beforeNotes = beforeNotes.filter((note: Note) =>
              foundBeforeNote.type === "M"
                ? note.rowIdx < foundBeforeNote.rowIdx
                : note.rowIdx <= foundBeforeNote.rowIdx
            );
          }

          let afterNotes: Note[] = notes[indicator.column].filter(
            (note: Note) => note.rowIdx > start
          );
          const foundAfterNote: Note | undefined = afterNotes.find(
            (note: Note) => ["X", "M", "W"].includes(note.type)
          );
          if (foundAfterNote) {
            afterNotes = afterNotes.filter((note: Note) =>
              foundAfterNote.type === "W"
                ? note.rowIdx > foundAfterNote.rowIdx
                : note.rowIdx >= foundAfterNote.rowIdx
            );
          }

          updatedNotes = [...beforeNotes, ...afterNotes];
        } else {
          // startの場所に単ノートを新規追加
          updatedNotes = [
            ...notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            ),
            { rowIdx: start, type: "X" },
            ...notes[indicator.column].filter(
              (note: Note) => note.rowIdx > start
            ),
          ];
        }
      } else {
        const hold: Note[] = Array.from<any, Note>(
          { length: goal - start + 1 },
          (_, idx: number) => {
            return {
              rowIdx: start + idx,
              type: idx === 0 ? "M" : idx === goal - start ? "W" : "H",
            };
          }
        );

        if (
          notes[indicator.column].filter(
            (note: Note) => note.rowIdx >= start && note.rowIdx <= goal
          ).length > 0
        ) {
          // startとgoalとの間に属するホールド(M/H/W)を削除してから
          // startとgoalとの間にホールドを新規追加
          let beforeNotes: Note[] = notes[indicator.column].filter(
            (note: Note) => note.rowIdx < start
          );
          const foundBeforeNote: Note | undefined = [...beforeNotes]
            .reverse()
            .find((note: Note) => ["X", "M", "W"].includes(note.type));
          if (foundBeforeNote) {
            beforeNotes = beforeNotes.filter((note: Note) =>
              foundBeforeNote.type === "M"
                ? note.rowIdx < foundBeforeNote.rowIdx
                : note.rowIdx <= foundBeforeNote.rowIdx
            );
          }

          let afterNotes: Note[] = notes[indicator.column].filter(
            (note: Note) => note.rowIdx > goal
          );
          const foundAfterNote: Note | undefined = afterNotes.find(
            (note: Note) => ["X", "M", "W"].includes(note.type)
          );
          if (foundAfterNote) {
            afterNotes = afterNotes.filter((note: Note) =>
              foundAfterNote.type === "W"
                ? note.rowIdx > foundAfterNote.rowIdx
                : note.rowIdx >= foundAfterNote.rowIdx
            );
          }

          updatedNotes = [...beforeNotes, ...hold, ...afterNotes];
        } else {
          // startとgoalとの間にホールドを新規追加
          updatedNotes = [
            ...notes[indicator.column].filter(
              (note: Note) => note.rowIdx < start
            ),
            ...hold,
            ...notes[indicator.column].filter(
              (note: Note) => note.rowIdx > goal
            ),
          ];
        }
      }

      // 元に戻す/やり直すスナップショットの集合を更新
      setUndoSnapshots([...undoSnapshots, { blocks: null, notes }]);
      setRedoShapshots([]);

      setIsProtected(true);

      // 単ノート/ホールドの追加・削除を行った譜面に更新
      setNotes(
        notes.map((notes: Note[], column: number) =>
          column === indicator.column ? updatedNotes : notes
        )
      );
    }

    // ホールド設置中の表示パラメーターを初期化
    if (holdSetter !== null) {
      setHoldSetter(null);
    }

    if (selector.setting !== null) {
      // 選択領域入力時の場合は選択領域を入力時→入力後に更新
      setSelector({
        setting: null,
        completed: { ...selector.setting },
      });
    }
  };

  const handleSetHold = useCallback(() => {
    // インディケーターが非表示/選択領域が表示中の場合はNOP
    if (
      indicator === null ||
      selector.setting !== null ||
      selector.completed !== null
    )
      return;

    // 「Start Setting Hold」を選択したインディケーターの表示パラメーターを用いて、
    // ホールド設置中の表示パラメーターを保持
    setHoldSetter({
      column: indicator.column,
      isSettingByMenu: true,
      rowIdx: indicator.rowIdx,
      top: indicator.top,
    });
  }, [indicator, setHoldSetter]);

  const handleSelect = useCallback(() => {
    // インディケーターが非表示/ホールド設置中の場合はNOP
    if (indicator === null || holdSetter !== null) return;

    // 「Start Selecting」を選択したインディケーターの表示パラメーターを用いて、選択領域を表示
    setSelector({
      setting: {
        isSettingByMenu: true,
        mouseDownColumn: indicator.column,
        mouseDownRowIdx: indicator.rowIdx,
        mouseUpColumn: indicator.column,
        mouseUpRowIdx: indicator.rowIdx,
      },
      completed: null,
    });
  }, [indicator, holdSetter]);

  const handleSplit = useCallback(() => {
    // インディケーターが非表示/譜面のブロックの先頭の行にインディケーターが存在する場合はNOP
    if (
      indicator === null ||
      (indicator !== null &&
        indicator.rowIdx === indicator.blockAccumulatedRows)
    )
      return;

    // 元に戻す/やり直すスナップショットの集合を更新
    setUndoSnapshots([...undoSnapshots, { blocks, notes: null }]);
    setRedoShapshots([]);

    setIsProtected(true);

    // blockIdx番目の譜面のブロックを、(rowIdx- 1)番目以前とrowIdx番目とで分割
    setBlocks([
      ...blocks.slice(0, indicator.blockIdx),
      {
        ...blocks[indicator.blockIdx],
        rows: indicator.rowIdx - indicator.blockAccumulatedRows,
      },
      {
        ...blocks[indicator.blockIdx],
        accumulatedRows: indicator.rowIdx,
        rows:
          blocks[indicator.blockIdx].rows +
          indicator.blockAccumulatedRows -
          indicator.rowIdx,
      },
      ...blocks.slice(indicator.blockIdx + 1),
    ]);
    setIndicator({
      ...indicator,
      blockIdx: indicator.blockIdx + 1,
      blockAccumulatedRows: indicator.rowIdx,
    });
  }, [
    blocks,
    indicator,
    setBlocks,
    setIndicator,
    setIsProtected,
    setRedoShapshots,
    setUndoSnapshots,
    undoSnapshots,
  ]);

  return (
    <>
      {[...Array(columns)].map((_, column: number) => (
        <div key={column} style={{ display: "flex" }}>
          {column === 0 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
          <div
            onContextMenu={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => {
              event.preventDefault();
              setPosition({
                top: event.clientY,
                left: event.clientX,
              });
            }}
            onMouseMove={(
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => handleMouseMove(event, column)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={{ display: "flex" }}
          >
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: `${noteSize - verticalBorderSize}px`,
              }}
            >
              <ChartVertical
                blockYDists={blockYDists}
                column={column}
                notes={notes[column]}
              />
            </div>
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          </div>
          {column === columns - 1 && (
            <BorderLine
              style={{ height: "100%", width: `${verticalBorderSize * 0.5}px` }}
            />
          )}
        </div>
      ))}
      <ChartIndicator />
      <ChartIndicatorMenu
        handler={{
          setHold: handleSetHold,
          select: handleSelect,
          split: handleSplit,
        }}
      />
      {selector.setting !== null && (
        <ChartSelector mouseCords={selector.setting} />
      )}
      {selector.completed !== null && (
        <ChartSelector mouseCords={selector.completed} />
      )}
    </>
  );
}

export default Chart;
