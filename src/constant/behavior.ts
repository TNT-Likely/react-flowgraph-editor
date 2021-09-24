/** G6行为 */
export const BehaviorType = {
  DragNode: 'drag-node',
  DragCanvas: 'drag-canvas',
  CreateEdge: 'create-edge',
  ClickSelect: 'click-select',
  BrushSelect: 'brush-select',
  DragAddNode: 'drag-add-node',

  /** 拖拽创建边 */
  DragAddEdge: 'drag-add-edge',

  /** 拖拽移动边 */
  DragMoveEdge: 'drag-move-edge',

  /** 悬浮在元素上 */
  HoverItem: 'hover-item',

  /** 点击元素 */
  ClickItem: 'click-item',

  /** 回溯路径 */
  RecallEdge: 'recall-edge',

  /** 拖拽改变节点大小 */
  DragResizeNode: 'drag-resize-node',

  /** 拖拽改变组大小 */
  DragResizeCombo: 'drag-resize-combo',

  /** 移动节点 */
  MoveNode: 'move-node',

  /** 拖动组 */
  DragCombo: 'drag-combo',

  /** 快捷键 */
  ShortCuts: 'short-cuts',

  /** 移动折线边 */
  MovePolyline: 'move-polyline',
};

/** 默认支持的交互行为 */
export const DefaultBehaviors = [
  // BehaviorType.DragNode,
  // BehaviorType.DragCanvas,
  BehaviorType.DragAddEdge,
  BehaviorType.DragMoveEdge,
  BehaviorType.HoverItem,
  BehaviorType.ClickItem,
  BehaviorType.DragResizeNode,
  BehaviorType.DragResizeCombo,
  BehaviorType.MoveNode,
  BehaviorType.DragCombo,
  BehaviorType.ShortCuts,
  BehaviorType.ClickSelect,
  {
    type: BehaviorType.BrushSelect,
    trigger: 'drag',
  },
  BehaviorType.MovePolyline,
  // BehaviorType.RecallEdge
];
