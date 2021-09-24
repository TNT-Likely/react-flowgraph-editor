import G6 from '@antv/g6';
import { transform, mat3 } from '@antv/matrix-util';
import {
  NodeType,
  ItemState,
  WRAPPER_CLASS_NAME,
  LABEL_CLASS_NAME,
} from '@/constant';

import GGroup from '@antv/g-canvas/lib/group';
import { NodeConfig } from '@antv/g6/lib/types';

const bizFlowNode: any = {
  drawWrapper(model: NodeConfig, group: GGroup) {
    const [width, height] = this.getSize(model);

    const shape = group.addShape('rect', {
      className: WRAPPER_CLASS_NAME,
      draggable: true,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
      },
    });

    // let matrix = shape.getMatrix();

    // if (!matrix) matrix = mat3.create();

    // const newMatrix = transform(matrix, [
    //   ['r', Math.PI / 4], // rotate
    // ]);

    // shape.setMatrix(newMatrix);

    return shape;
  },

  drawLabel(model: NodeConfig, group: GGroup) {
    const [width, height] = this.getSize(model);

    const shape = group.addShape('text', {
      className: LABEL_CLASS_NAME,
      draggable: true,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: model.label || '',
      },
    });

    // let matrix = shape.getMatrix();

    // if (!matrix) matrix = mat3.create();

    // const newMatrix = transform(matrix, [
    //   ['r', Math.PI / 4], // rotate
    // ]);

    // shape.setMatrix(newMatrix);

    return shape;
  },

  /** 更新label位置 */
  updateLabel(model: NodeConfig, group: GGroup) {
    const [width, height] = this.getSize(model);
    const shape = group.findByClassName(LABEL_CLASS_NAME);
    shape.attr({
      x: width / 2,
      y: height / 2,
    });
  },

  /** 更新wrapper */
  updateWrapper(model: NodeConfig, group: GGroup) {
    const shape = group.findByClassName(WRAPPER_CLASS_NAME);
    const [width, height] = this.getSize(model);
    shape.attr({
      width,
      height,
    });
  },

  getCustomConfig() {
    return {
      size: [120, 50],
    };
  },
};

G6.registerNode(NodeType.FlowRect, bizFlowNode, NodeType.FlowBase);
