import { useCallback } from "react";
import { selectorState } from "../service/atoms";
import { useRecoilValue } from "recoil";
import { SelectedCords } from "../types/chart";
import { Selector } from "../types/chart";

function useSelectedCords() {
  const selector = useRecoilValue<Selector>(selectorState);

  const getSelectedCords: () => null | SelectedCords = useCallback(() => {
    if (
      selector.completed === null ||
      selector.completed.mouseUpColumn === null ||
      selector.completed.mouseUpRowIdx === null
    )
      return null;

    return {
      startColumn: Math.min(
        selector.completed.mouseDownColumn,
        selector.completed.mouseUpColumn
      ),
      goalColumn: Math.max(
        selector.completed.mouseDownColumn,
        selector.completed.mouseUpColumn
      ),
      startRowIdx: Math.min(
        selector.completed.mouseDownRowIdx,
        selector.completed.mouseUpRowIdx
      ),
      goalRowIdx: Math.max(
        selector.completed.mouseDownRowIdx,
        selector.completed.mouseUpRowIdx
      ),
    };
  }, [selector.completed]);

  return { getSelectedCords };
}

export default useSelectedCords;
