/**
 * Store for zustand
 */
export type Store = {
  /**
   * true for dark mode, false for light mode
   */
  isDarkMode: boolean;

  /**
   * Update dark mode
   */
  setIsDarkMode: (isDarkMode: boolean) => void;
};
