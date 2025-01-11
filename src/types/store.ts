/**
 * Store for zustand
 */
export type Store = {
  /**
   * true for dark mode, false for light mode
   */
  isDarkMode: boolean;

  /**
   * Setter for isDarkMode
   */
  setIsDarkMode: (isDarkMode: boolean) => void;

  /**
   * mp3NameState
   */
  mp3Name: string | null;

  /**
   * Setter for mp3Name
   */
  setMp3Name: (mp3Name: string | null) => void;

  /**
   * Success message
   */
  successMessage: string;

  /**
   * Setter for successMessage
   */
  setSuccessMessage: (successMessage: string) => void;

  /**
   * Volume value
   * 0 for mute, 1 for max
   */
  volumeValue: number;

  /**
   * Setter for volumeValue
   */
  setVolumeValue: (volumeValue: number) => void;
};
