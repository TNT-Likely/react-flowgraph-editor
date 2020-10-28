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
