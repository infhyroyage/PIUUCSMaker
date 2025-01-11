import { HoldSetter } from "./chart";

/**
 * Store for zustand
 */
export type Store = {
  /**
   * Display parameter when setting a hold
   * null if not setting a hold
   */
  holdSetter: HoldSetter | null;

  /**
   * Setter for holdSetter
   */
  setHoldSetter: (holdSetter: HoldSetter | null) => void;

  /**
   * true for dark mode, false for light mode
   */
  isDarkMode: boolean;

  /**
   * Toggle isDarkMode
   */
  toggleIsDarkMode: () => void;

  /**
   * true if beat sound is mute, otherwise false
   */
  isMuteBeats: boolean;

  /**
   * Toggle isMuteBeats
   */
  toggleIsMuteBeats: () => void;

  /**
   * true if chart is single performance or double performance,
   * false if chart is single or double
   */
  isPerformance: boolean;

  /**
   * Setter for isPerformance
   */
  setIsPerformance: (isPerformance: boolean) => void;

  /**
   * true if playing the chart, otherwise false
   */
  isPlaying: boolean;

  /**
   * Setter for isPlaying
   */
  setIsPlaying: (isPlaying: boolean) => void;

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
   * Message displayed UserErrorSnackbar
   */
  userErrorMessage: string;

  /**
   * Setter for userErrorMessage
   */
  setUserErrorMessage: (userErrorMessage: string) => void;

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
