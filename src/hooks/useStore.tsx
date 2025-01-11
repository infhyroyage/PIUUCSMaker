import { create } from "zustand";
import { Store } from "../types/store";

/**
 * Store for zustand with initial values
 */
export const useStore = create<Store>()((set) => ({
  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
  mp3Name: null,
  setMp3Name: (mp3Name: string | null) => set({ mp3Name }),
  successMessage: "",
  setSuccessMessage: (successMessage: string) => set({ successMessage }),
  volumeValue: 0.5,
  setVolumeValue: (volumeValue: number) => set({ volumeValue }),
}));
