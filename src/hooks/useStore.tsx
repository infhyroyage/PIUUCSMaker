import { create } from "zustand";
import { HoldSetter, Indicator, Selector } from "../types/chart";
import {
  BlockControllerMenuPosition,
  ChartIndicatorMenuPosition,
  Zoom,
} from "../types/menu";
import { Store } from "../types/store";
import { ClipBoard } from "../types/ucs";

/**
 * Store for zustand with initial values
 */
export const useStore = create<Store>()((set) => ({
  blockControllerMenuBlockIdx: null,
  setBlockControllerMenuBlockIdx: (
    blockControllerMenuBlockIdx: number | null
  ) => set({ blockControllerMenuBlockIdx }),
  resetBlockControllerMenuBlockIdx: () =>
    set({ blockControllerMenuBlockIdx: null }),
  blockControllerMenuPosition: undefined,
  setBlockControllerMenuPosition: (
    blockControllerMenuPosition: BlockControllerMenuPosition
  ) => set({ blockControllerMenuPosition }),
  resetBlockControllerMenuPosition: () =>
    set({ blockControllerMenuPosition: undefined }),
  chartIndicatorMenuPosition: undefined,
  setChartIndicatorMenuPosition: (
    chartIndicatorMenuPosition: ChartIndicatorMenuPosition
  ) => set({ chartIndicatorMenuPosition }),
  resetChartIndicatorMenuPosition: () =>
    set({ chartIndicatorMenuPosition: undefined }),
  clipBoard: null,
  setClipBoard: (clipBoard: ClipBoard | null) => set({ clipBoard }),
  resetClipBoard: () => set({ clipBoard: null }),
  holdSetter: null,
  setHoldSetter: (holdSetter: HoldSetter | null) => set({ holdSetter }),
  resetHoldSetter: () => set({ holdSetter: null }),
  indicator: null,
  setIndicator: (indicator: Indicator) => set({ indicator }),
  resetIndicator: () => set({ indicator: null }),
  isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  toggleIsDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  isMuteBeats: true,
  toggleIsMuteBeats: () =>
    set((state) => ({ isMuteBeats: !state.isMuteBeats })),
  isPerformance: false,
  setIsPerformance: (isPerformance: boolean) => set({ isPerformance }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  mp3Name: null,
  setMp3Name: (mp3Name: string | null) => set({ mp3Name }),
  selector: { completed: null, isSettingByMenu: false, setting: null },
  setSelector: (selector: Selector) => set({ selector }),
  hideSelector: () =>
    set({
      selector: { completed: null, isSettingByMenu: false, setting: null },
    }),
  successMessage: "",
  setSuccessMessage: (successMessage: string) => set({ successMessage }),
  ucsName: null,
  setUcsName: (ucsName: string | null) => set({ ucsName }),
  userErrorMessage: "",
  setUserErrorMessage: (userErrorMessage: string) => set({ userErrorMessage }),
  volumeValue: 0.5,
  setVolumeValue: (volumeValue: number) => set({ volumeValue }),
  zoom: { idx: 0, top: null },
  setZoom: (zoom: Zoom) => set({ zoom }),
}));
