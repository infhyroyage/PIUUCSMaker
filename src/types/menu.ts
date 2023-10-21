import { PopoverPosition } from "@mui/material";

/**
 * BlockControllerMenuのメニューを開くブラウザの画面の座標
 * BlockControllerMenuのメニューが非表示の場合はundefined
 */
export type BlockControllerMenuPosition = PopoverPosition | undefined;

/**
 * ChartIndicatorMenuのメニューを開くブラウザの画面の座標
 * ChartIndicatorMenuのメニューが非表示の場合はundefined
 */
export type ChartIndicatorMenuPosition = PopoverPosition | undefined;

/**
 * 拡大/縮小時の表示パラメーター
 */
export type Zoom = {
  /**
   * 現在の倍率の値のインデックス
   */
  idx: number;

  /**
   * 拡大/縮小直後のブラウザの画面のy座標
   * 1度も拡大/縮小していない場合はnull
   */
  top: number | null;
};
