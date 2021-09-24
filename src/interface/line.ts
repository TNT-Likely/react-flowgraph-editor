import { boolean, number } from '@hapi/joi';

/** 对齐线所需节点的配置 */
export interface ILineNodeConfig {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  left: [number, number];
  middle: [number, number];
  right: [number, number];
}

export type TLineAlignType = 'left' | 'middle' | 'right';
export interface ILineAlignType {
  [index: string]: TLineAlignType;
}
export interface ILineResult {
  /** 是否靠近 */
  near: boolean;

  /** 距离 */
  dist: number;

  /** 对齐的坐标点 */
  value: number;

  /** 对齐线id */
  lineId: string;

  /** 对齐的方向 x|y */
  key: TDirection;

  tNode: ILineNodeConfig;
  sNode: ILineNodeConfig;
  tDire: TLineAlignType;
  sDire: TLineAlignType;
}

export type TDirection = 'x' | 'y';
