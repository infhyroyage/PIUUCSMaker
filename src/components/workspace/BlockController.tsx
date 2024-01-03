import { useRecoilValue, useSetRecoilState } from "recoil";
import { Block, Note } from "../../types/ucs";
import { BlockControllerMenuPosition } from "../../types/menu";
import {
  blockControllerMenuBlockIdxState,
  blockControllerMenuPositionState,
  blocksState,
  noteSizeState,
  notesState,
} from "../../services/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { MouseEvent, useCallback, useMemo } from "react";
import BlockControllerMenu from "../menu/BlockControllerMenu";
import { IDENTIFIER_WIDTH, MENU_BAR_HEIGHT } from "../../services/styles";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";

function BlockController() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const setMenuBlockIdx = useSetRecoilState<number | null>(
    blockControllerMenuBlockIdxState
  );
  const setMenuPosition = useSetRecoilState<BlockControllerMenuPosition>(
    blockControllerMenuPositionState
  );

  const verticalBorderSize = useVerticalBorderSize();

  const maxWidth = useMemo(
    () =>
      `calc(100vw - ${
        MENU_BAR_HEIGHT +
        IDENTIFIER_WIDTH +
        notes.length * noteSize +
        verticalBorderSize
      }px)`,
    [notes.length, noteSize, verticalBorderSize]
  );

  // 押下したマウスの座標にBlockControllerMenuを表示
  const handleClickBlockControllerButton = useCallback(
    (
      event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
      blockIdx: number
    ) => {
      setMenuBlockIdx(blockIdx);
      setMenuPosition({ top: event.clientY, left: event.clientX });
    },
    [setMenuBlockIdx, setMenuPosition]
  );

  const allBlockControllerButton = useMemo(
    () =>
      blocks.map((block: Block, blockIdx: number) => (
        <BlockControllerButton
          key={blockIdx}
          bpm={block.bpm}
          delay={block.delay}
          isFirstBlock={blockIdx === 0}
          isLastBlock={blockIdx === blocks.length - 1}
          onClick={(
            event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
          ) => handleClickBlockControllerButton(event, blockIdx)}
          rows={block.rows}
          split={block.split}
        />
      )),
    [blocks, handleClickBlockControllerButton]
  );

  return (
    <div style={{ maxWidth }}>
      {allBlockControllerButton}
      <BlockControllerMenu />
    </div>
  );
}

export default BlockController;
