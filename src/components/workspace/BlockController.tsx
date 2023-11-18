import { useRecoilValue } from "recoil";
import { Block, Note } from "../../types/ucs";
import { Zoom } from "../../types/menu";
import {
  blocksState,
  noteSizeState,
  notesState,
  zoomState,
} from "../../services/atoms";
import BlockControllerButton from "./BlockControllerButton";
import { ZOOM_VALUES } from "../../services/assets";
import { useMemo } from "react";
import BlockControllerMenu from "../menu/BlockControllerMenu";
import { IDENTIFIER_WIDTH, MENU_BAR_HEIGHT } from "../../services/styles";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";

function BlockController() {
  const blocks = useRecoilValue<Block[]>(blocksState);
  const notes = useRecoilValue<Note[][]>(notesState);
  const noteSize = useRecoilValue<number>(noteSizeState);
  const zoom = useRecoilValue<Zoom>(zoomState);

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

  const allBlockControllerButton = useMemo(
    () =>
      blocks.map((block: Block, blockIdx: number) => (
        <BlockControllerButton
          key={blockIdx}
          blockHeight={
            (2.0 * noteSize * ZOOM_VALUES[zoom.idx] * block.rows) / block.split
          }
          blockIdx={blockIdx}
          isLastBlock={blockIdx === blocks.length - 1}
          textFirst={`${block.bpm} BPM, 1/${block.split}`}
          textSecond={`Delay: ${block.delay} (ms)`}
        />
      )),
    [blocks, noteSize, zoom.idx]
  );

  return (
    <div style={{ maxWidth }}>
      {allBlockControllerButton}
      <BlockControllerMenu />
    </div>
  );
}

export default BlockController;
