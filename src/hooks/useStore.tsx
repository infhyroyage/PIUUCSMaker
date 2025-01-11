import { create } from "zustand";
import { HoldSetter } from "../types/chart";
import { Store } from "../types/store";

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
  holdSetter: null,
  setHoldSetter: (holdSetter: HoldSetter | null) => set({ holdSetter }),
  resetHoldSetter: () => set({ holdSetter: null }),
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
  successMessage: "",
  setSuccessMessage: (successMessage: string) => set({ successMessage }),
  userErrorMessage: "",
  setUserErrorMessage: (userErrorMessage: string) => set({ userErrorMessage }),
  volumeValue: 0.5,
  setVolumeValue: (volumeValue: number) => set({ volumeValue }),
}));
