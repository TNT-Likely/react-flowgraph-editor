import G6 from '@antv/g6';
import {
  NodeType,
  ItemState,
  WRAPPER_CLASS_NAME,
  LABEL_CLASS_NAME,
} from '@/constant';

import GGroup from '@antv/g-canvas/lib/group';
import { NodeConfig } from '@antv/g6/lib/types';

const bizFlowNode: any = {
  /** 绘制wrapper */
  drawWrapper(model: NodeConfig, group: GGroup) {
    const [rx, ry] = this.getSize(model);
    const { wrapperStyle } = this.getOptions(model);

    const shape = group.addShape(NodeType.Ellipse, {
      className: WRAPPER_CLASS_NAME,
      draggable: true,
      attrs: {
        x: rx / 2,
        y: ry / 2,
        rx: rx / 2,
        ry: ry / 2,
        ...wrapperStyle,
      },
    });

    return shape;
  },

  /** 绘制标签 */
  drawLabel(model: NodeConfig, group: GGroup) {
    const [rx, ry] = this.getSize(model);
    const { labelStyle } = this.getOptions(model);

    const shape = group.addShape('text', {
      className: LABEL_CLASS_NAME,
      draggable: true,
      attrs: {
        x: rx / 2,
        y: ry / 2,
        text: model.label || '',
        ...labelStyle,
      },
    });

    return shape;
  },

  /** 更新wrapper */
  updateWrapper(model: NodeConfig, group: GGroup) {
    const shape = group.findByClassName(WRAPPER_CLASS_NAME);
    const [rx, ry] = this.getSize(model);
    const { wrapperStyle } = this.getOptions(model);
    shape.attr({
      ...wrapperStyle,
      x: rx / 2,
      y: ry / 2,
      rx: rx / 2,
      ry: ry / 2,
    });
  },

  /** 更新label位置 */
  updateLabel(model: NodeConfig, group: GGroup) {
    const [rx, ry] = this.getSize(model);
    const shape = group.findByClassName(LABEL_CLASS_NAME);
    const { labelStyle } = this.getOptions(model);
    shape.attr({
      ...labelStyle,
      x: rx / 2,
      y: ry / 2,
    });
  },

  getCustomConfig() {
    return {
      size: [120, 120],
    };
  },
};

G6.registerNode(NodeType.FlowCircle, bizFlowNode, NodeType.FlowBase);
