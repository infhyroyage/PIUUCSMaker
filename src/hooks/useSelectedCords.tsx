import { useCallback } from "react";
import { selectorState } from "../service/atoms";
import { useRecoilValue } from "recoil";
import { SelectedCords, Selector } from "../types/chart";

function useSelectedCords() {
  const selector = useRecoilValue<Selector>(selectorState);

  const getSelectedCords: () => null | SelectedCords = useCallback(() => {
    if (
      selector.completedCords === null ||
      selector.completedCords.mouseUpColumn === null ||
      selector.completedCords.mouseUpRowIdx === null
    )
      return null;

    return {
      startColumn: Math.min(
        selector.completedCords.mouseDownColumn,
        selector.completedCords.mouseUpColumn
      ),
      goalColumn: Math.max(
        selector.completedCords.mouseDownColumn,
        selector.completedCords.mouseUpColumn
      ),
      startRowIdx: Math.min(
        selector.completedCords.mouseDownRowIdx,
        selector.completedCords.mouseUpRowIdx
      ),
      goalRowIdx: Math.max(
        selector.completedCords.mouseDownRowIdx,
        selector.completedCords.mouseUpRowIdx
      ),
    };
  }, [selector.completedCords]);

  return { getSelectedCords };
}

export default useSelectedCords;
