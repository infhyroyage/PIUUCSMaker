import { MouseEvent, useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useStore } from "../../hooks/useStore";
import useVerticalBorderSize from "../../hooks/useVerticalBorderSize";
import { blocksState } from "../../services/atoms";
import { IDENTIFIER_WIDTH, NAVIGATION_BAR_HEIGHT } from "../../services/styles";
import { Block } from "../../types/ucs";
import BlockControllerMenu from "../menu/BlockControllerMenu";
import BlockControllerButton from "./BlockControllerButton";

function BlockController() {
  const {
    setBlockControllerMenuBlockIdx,
    setBlockControllerMenuPosition,
    notes,
    noteSize,
  } = useStore();
  const blocks = useRecoilValue<Block[]>(blocksState);

  const verticalBorderSize = useVerticalBorderSize();

  const maxWidth = useMemo(
    () =>
      `calc(100vw - ${
        NAVIGATION_BAR_HEIGHT +
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
      setBlockControllerMenuBlockIdx(blockIdx);
      setBlockControllerMenuPosition({
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setBlockControllerMenuBlockIdx, setBlockControllerMenuPosition]
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
