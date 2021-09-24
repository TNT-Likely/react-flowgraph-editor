import { IItemType } from '@/interface';

/** G6元素 */
export const ItemType: IItemType = {
  Node: 'node',
  Edge: 'edge',
  Combo: 'combo',
};

/** G6节点类型 */
export const NodeType = {
  Circle: 'circle',
  Rect: 'rect',
  Ellipse: 'ellipse',
  Diamond: 'diamond',
  Triangle: 'triangle',
  Star: 'star',
  Image: 'image',
  ModelRect: 'modelRect',
  FlowBase: 'flowBase',
  FlowRect: 'flowRect',
  FlowRoundRect: 'flowRoundRect',
  FlowCircle: 'flowCircle',
  FlowDiamond: 'flowDiamond',
  FlowText: 'flowText',
};

/** 图形类型 */
export const ShapeType = {
  Circle: 'circle',
  Rect: 'rect',
  Ellipse: 'ellipse',
  Polygon: 'polygon',
  Fan: 'fan',
  Image: 'image',
  Marker: 'marker',
  Path: 'path',
  Text: 'text',
};

/** G6边类型 */
export const EdgeType = {
  Line: 'line',
  Polyline: 'polyline',
  Arc: 'arc',
  Quadratic: 'quadartic',
  Cubic: 'cubic',
  CubucVertical: 'cubic-vertical',
  CUbicHorizontal: 'cubic-horizontal',
  Loop: 'loop',
  FlowEdge: 'flow-edge',
};

/** 组合类型 */
export const ComboType = {
  Rect: 'rect',
  Circle: 'circle',
  FlowCombo: 'flow-combo',
};

/** 自定义节点-包裹类名 */
export const WRAPPER_CLASS_NAME = 'node-wrapper';

/** 自定义节点-标签类名 */
export const LABEL_CLASS_NAME = 'node-label';

/** 自定义节点-包裹内边距 */
export const WRAPPER_HORIZONTAL_PADDING = 10;

/** 自定义边 - 文本类名 */
export const EDGE_LABEL_CLASS_NAME = 'edge-label';

/** 自定义边 - 文本包裹类名 */
export const EDGE_LABEL_WRAPPER_CLASS_NAME = 'edge-label-wrapper-label';

/** 自定义边 - 开始占位符名称 */
export const EDGE_START_PLACEHOLDER_NAME = 'flow-edge-start-placeholder';

/** 自定义边 - 结束占位符名称 */
export const EDGE_END_PLACEHOLDER_NAME = 'flow-edge-end-placeholder';

/** 自定义边 - 拖拽线名称 */
export const DRAGLINE_NAME = 'edge-shape-dragline';

/** 自定义边 - 拖拽线index */
export const DRAGLINE_INDEX = 'draglineIndex';
