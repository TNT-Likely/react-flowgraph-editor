import { Instance } from '../';
import { guid } from '@/util';

import { Color } from '@/constant';
import { INode } from '@antv/g6/lib/interface/item';
import { IDirection, ILineNodeConfig, TLineAlignType } from '@/interface';
import { ModelConfig, NodeConfig } from '@antv/g6/lib/types';

const X_LINE_NAME = 'x-line';
const Y_LINE_NAME = 'y-line';
const SHAPE_STYLE = {
  lineWidth: 1,
  stroke: Color.SnapLine,
  opacity: 1,
};

/**
 * 绘制线条
 * @param {IDirection} direction 方向 x|y
 * @param {number} value 绘制的坐标
 * @param {number} id 线条的id
 */
export const drawLine = (direction: IDirection, value: number, id = guid()) => {
  const { graph } = Instance;
  const w = graph.getWidth();
  const h = graph.getHeight();
  const group = graph.getGroup();
  const isX = direction === 'x';
  const shapeName = isX ? Y_LINE_NAME : X_LINE_NAME;
  const shape = group.findById(id);

  const getPath = () => {
    if (isX) {
      return [
        ['M', value, 0],
        ['L', value, h],
      ];
    }
    return [
      ['M', 0, value],
      ['L', w, value],
    ];
  };

  if (!shape) {
    group.addShape('path', {
      name: shapeName,
      id,
      attrs: {
        path: getPath(),
        ...SHAPE_STYLE,
      },
    });
  } else {
    shape.attr({
      path: getPath(),
      ...SHAPE_STYLE,
    });
  }
};

/**
 * 删除线条
 * @param {IDirection} direction 方向 x|y
 * @param {number} value 绘制的坐标
 */
export const removeLine = (direction: IDirection) => {
  const { graph } = Instance;
  const group = graph.getGroup();
  const shapeName = direction === 'x' ? Y_LINE_NAME : X_LINE_NAME;
  const shapes = group.findAllByName(shapeName);
  shapes.forEach((shape) => {
    group.removeChild(shape);
  });
};

/**
 * 切换指定线条展示状态
 * @param {string} id 线条id
 * @param {boolean} visible 是否展示
 */
export const toggleLine = (id: string, visible = false) => {
  const { graph } = Instance;
  const group = graph.getGroup();
  const shape = group.findById(id);
  if (shape) {
    shape.attr({
      opacity: visible ? 1 : 0,
    });
  }
};

/**
 * 对齐两个节点
 * @param {object} sNode 源节点
 * @param {object} tNode 目标节点
 * @param {string} sAlignType 源对齐类型 left|middle|right
 * @param {string} tAlignType 目标对齐类型 left |middle|right
 * @param {string} direction 对齐方向 x|y
 */
export const alignTwoNodes = (
  sNode: ILineNodeConfig,
  tNode: ILineNodeConfig,
  sAlignType: TLineAlignType,
  tAlignType: TLineAlignType,
  direction: IDirection,
) => {
  const ALIGN_TYPE = {
    left: 0,
    middle: 0.5,
    right: 1,
  };
  const posIndex = direction === 'x' ? 0 : 1;
  const posBase = direction === 'x' ? sNode.w : sNode.h;

  const { graph } = Instance;

  const value = tNode[sAlignType][posIndex] - posBase * ALIGN_TYPE[tAlignType];

  const model: ModelConfig = {};
  model[direction] = value;

  graph.updateItem(sNode.id, model, false);
};

/**
 * 获取节点模型数据
 * @param {object} node 节点
 */
export const getNodeModel = (node: INode): ILineNodeConfig => {
  let { x = 0, y = 0, size, id } = node.getModel();
  let w = 0,
    h = 0;
  if (typeof size === 'number') {
    w = size;
    h = size;
  }

  if (Array.isArray(size)) {
    w = size[0];
    h = size[1];
  }

  return {
    id: id || '',
    x,
    y,
    w,
    h,
    left: [x, y],
    middle: [x + 0.5 * w, y + 0.5 * h],
    right: [x + w, y + h],
  };
};
