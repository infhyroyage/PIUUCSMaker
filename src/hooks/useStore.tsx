import { create } from "zustand";
import { Store } from "../types/store";

/**
 * Store for zustand
 */
export const useStore = create<Store>()((set) => ({
  isDarkMode: false,
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
}));
