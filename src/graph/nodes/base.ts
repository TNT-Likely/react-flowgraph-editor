import G6 from '@antv/g6';
import merge from 'lodash/merge';
import isArray from 'lodash/isArray';
import {
  ItemState,
  NodeType,
  WRAPPER_CLASS_NAME,
  LABEL_CLASS_NAME,
  WRAPPER_HORIZONTAL_PADDING,
} from '@/constant';
import { optimizeMultilineText } from '@/util';
import {
  drawControlPoints,
  removeControlPoints,
  drawAnchorPoints,
  removeAnchorPoints,
} from '../common/anchor';

import GGroup from '@antv/g-canvas/lib/group';
import { ModelConfig, NodeConfig } from '@antv/g6/lib/types';
import { INode } from '@antv/g6/lib/interface/item';

const controlPoints = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

const bizNode: any = {
  options: {
    wrapperStyle: {
      fill: '#fff',
      lineWidth: 2,
      stroke: '#5487ea',
    },
    labelStyle: {
      fontSize: 14,
      lineHeight: 14,
      fill: '#000000',
      textAlign: 'center',
      textBaseline: 'middle',
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      },
      [ItemState.Selected]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {},
      },
    },
  },

  getOptions(model: NodeConfig) {
    return merge({}, this.options, this.getCustomConfig() || {}, model);
  },

  draw(model: NodeConfig, group: GGroup) {
    /** 更新模型中的size数据, 后面很多环节可以用得到，不要删除 */
    model.size = this.getSize(model);

    const keyShape = this.drawWrapper(model, group);

    this.drawLabel(model, group);

    return keyShape;
  },

  setLabelText(model: NodeConfig, group: GGroup) {
    const shape = group.findByClassName(LABEL_CLASS_NAME);

    if (!shape) {
      return;
    }

    const [width = 0] = this.getSize(model);
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr();

    const text = <string>model.label || '';
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    shape.attr(
      'text',
      optimizeMultilineText(
        text,
        font,
        2,
        width - WRAPPER_HORIZONTAL_PADDING * 2,
      ),
    );
  },

  update(model: NodeConfig, item: INode) {
    const group = item.getContainer();

    this.setLabelText(model, group);
    this.updateLabel(model, group);
    this.updateWrapper(model, group);
  },

  setState(name: string, value: boolean, item: INode) {
    const group = item.getContainer();
    const model = item.getModel();
    const states =
      item.getStates() ||
      [WRAPPER_CLASS_NAME, LABEL_CLASS_NAME].forEach((className: string) => {
        const shape = group.findByClassName(className);
        const options = this.getOptions(model);

        const shapeName = className.split('-')[1];

        shape.attr({
          ...options[`${shapeName}Style`],
        });

        states.forEach(state => {
          if (
            options.stateStyles[state] &&
            options.stateStyles[state][`${shapeName}Style`]
          ) {
            shape.attr({
              ...options.stateStyles[state][`${shapeName}Style`],
            });
          }
        });
      });

    if (name === ItemState.Selected) {
      if (value) {
        /** 绘制拉伸控制点 */
        drawControlPoints(item);
      } else {
        /** 删除拉伸控制点 */
        removeControlPoints(item);
      }
    }

    if (
      item.hasState(ItemState.ActiveAnchorPoints) ||
      item.hasState(ItemState.Selected)
    ) {
      drawAnchorPoints(this, item);
    } else {
      removeAnchorPoints(item);
    }

    if (this.afterSetState) {
      this.afterSetState(name, value, item);
    }
  },

  afterSetState(name: string, value: boolean, item: INode) {},

  getSize(model: NodeConfig) {
    const { size } = this.getOptions(model);

    if (!size) {
      return size;
    }

    if (!isArray(size)) {
      return [size, size];
    }

    return size;
  },

  getCustomConfig() {
    return {};
  },

  getAnchorPoints() {
    return [
      [0.5, 0],
      [1, 0.5],
      [0.5, 1],
      [0, 0.5],
    ];
  },
};

G6.registerNode(NodeType.FlowBase, bizNode);
