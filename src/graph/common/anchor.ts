import {
  ItemState,
  AnchorPointState,
  ANCHOR_POINT_NAME,
  CONTROL_POINT_NAME,
  Color,
} from '@/constant';
import { INode } from '@antv/g6/lib/interface/item';
import { IPoint } from '@antv/g6/lib/types';

/** 获取锚点默认样式 */
const getAnchorPointDefaultStyle = (item: INode, anchorPoint: number[]) => {
  const model = item.getModel();
  const [width, height] = model.size as number[];

  const [x, y] = anchorPoint;

  return {
    x: width * x,
    y: height * y,
    r: 4,
    lineWidth: 1,
    fill: '#FFFFFF',
    stroke: Color.Base,
    cursor: 'crosshair',
  };
};

/** 绘制锚点 */
function drawAnchorPoints(_this: any, item: INode) {
  const group = item.getContainer();
  const model = item.getModel();
  const anchorPoints = _this.getAnchorPoints(model) || [];

  const shapes = group.findAllByName(ANCHOR_POINT_NAME);

  anchorPoints.forEach((anchorPoint: number[], index: number) => {
    /** 锚点存在更新，不存在则绘制新锚点 */
    if (!shapes.length) {
      group.addShape('circle', {
        name: ANCHOR_POINT_NAME,
        attrs: {
          ...getAnchorPointDefaultStyle(item, anchorPoint),
        },
        isAnchorPoint: true,
        anchorPointIndex: index,
        anchorPointState: AnchorPointState.Enabled,
      });
    } else {
      shapes[index].attr({
        ...getAnchorPointDefaultStyle(item, anchorPoint),
      });
    }
  });
}

/** 移除锚点 */
const removeAnchorPoints = (item: INode) => {
  const group = item.getContainer();
  const anchorPoints = group.findAllByName(ANCHOR_POINT_NAME);

  anchorPoints.forEach((anchorPoint) => {
    group.removeChild(anchorPoint);
  });
};

const controlPoints = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

/** 绘制控制点 */
const drawControlPoints = (item: INode) => {
  const group = item.getContainer();
  const shapes = group.findAllByName(CONTROL_POINT_NAME);
  const hasLocked = item.hasLocked();
  if (!shapes.length) {
    controlPoints.forEach((point, index) => {
      if (hasLocked) {
        group.addShape('text', {
          name: CONTROL_POINT_NAME,
          point,
          attrs: {
            fill: Color.SnapLine,
            text: 'x',
            fontSize: 18,
          },
        });
      } else {
        group.addShape('rect', {
          name: CONTROL_POINT_NAME,
          point,
          attrs: {
            width: 8,
            height: 8,
            lineWidth: 1,
            fill: '#FFFFFF',
            stroke: Color.Base,
            cursor: [0, 3].includes(index) ? 'nwse-resize' : 'nesw-resize',
          },
        });
      }
    });
  }

  updateControlPoints(item);
};

/** 更新控制点 */
const updateControlPoints = (item: INode) => {
  const group = item.getContainer();
  const model = item.getModel();
  const locked = item.hasLocked();
  const [width, height] = model.size as number[];
  const shapes = group.findAllByName(CONTROL_POINT_NAME);
  controlPoints.forEach((point, index) => {
    const [x, y] = point;
    shapes[index].attr({
      x: width * x + (locked ? -4 : -4),
      y: height * y + (locked ? 8 : -4),
    });
  });
};

/** 删除控制点 */
const removeControlPoints = (item: INode) => {
  const group = item.getContainer();
  const controlPoints = group.findAllByName(CONTROL_POINT_NAME);
  controlPoints.forEach((controlPoint) => {
    group.removeChild(controlPoint);
  });
};

export {
  drawAnchorPoints,
  removeAnchorPoints,
  drawControlPoints,
  removeControlPoints,
  updateControlPoints,
};
