import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { isOpenedMenuDrawerState } from "../service/atoms";

function useMenuDrawerStyles() {
  const isOpenedMenuDrawer = useRecoilValue<boolean>(isOpenedMenuDrawerState);

  const listItemButtonStyle = useMemo(() => {
    return {
      justifyContent: isOpenedMenuDrawer ? "initial" : "center",
      minHeight: 48,
      px: 2.5,
    };
  }, [isOpenedMenuDrawer]);

  const listItemIconStyle = useMemo(() => {
    return {
      justifyContent: "center",
      minWidth: 0,
      mr: isOpenedMenuDrawer ? 3 : "auto",
    };
  }, [isOpenedMenuDrawer]);

  return { listItemButtonStyle, listItemIconStyle };
}

export default useMenuDrawerStyles;
