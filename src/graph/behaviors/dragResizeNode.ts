import G6 from '@antv/g6';

import { Instance } from '@/index';
import {
  BehaviorType,
  CONTROL_POINT_NAME,
  NodeType,
  ActionType,
} from '@/constant';
import { showTooltip, hideTooltip, getStackData } from '@/util';

import { Graph } from '@antv/g6';
import { IBehaviorOption } from '@/interface';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { IPoint, Item } from '@antv/g6/lib/types';
import { INode } from '@antv/g6/lib/interface/item';

const behavior: any = {
  getDefaultCfg() {
    return {};
  },

  getEvents() {
    return {
      'node:mousedown': 'handleNodeMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  handleNodeMouseDown(e: G6GraphEvent) {
    const { target, item } = e;
    if (!target) return;

    const name = target.get('name');
    if (name === CONTROL_POINT_NAME && !item.hasLocked()) {
      this.isResize = true;
      this.attrs = target.get('canvasBBox');
      this.point = target.get('point');
      this.item = item;
      this.itemModel = item.getBBox();
      this.stackData = getStackData(item);
    }
  },

  handleMouseMove(e: G6GraphEvent) {
    if (this.isResize) {
      const { point, attrs, item, itemModel, graph } = this;
      const { x, y } = attrs;
      const { width, height, x: itemX, y: itemY } = itemModel as any;
      const { canvasX, canvasY } = e;
      const { type } = item.getModel();
      const { ratio } = Instance;

      /** 鼠标拖动的偏移量 */
      const offsetLeft = (canvasX - x) * ratio;
      const offsetTop = (canvasY - y) * ratio;

      let size;
      let position;

      switch (type) {
        default:
          size = [
            width + (point[0] || -1) * offsetLeft,
            height + (point[1] || -1) * offsetTop,
          ];
          position = {
            x: itemX + (point[0] - 1) * offsetLeft * -1,
            y: itemY + (point[1] - 1) * offsetTop * -1,
          };
          break;
      }

      /** 更新节点大小，位置信息 */
      graph.updateItem(item, { size, ...position }, false);

      /** 展示节点大小信息 */
      showTooltip(
        `W: ${parseInt(size[0])}  H:${parseInt(size[1])}`,
        <INode>item,
      );
    }
  },

  handleMouseUp() {
    if (this.isResize) {
      this.isResize = false;
      hideTooltip();
      Instance.graph.pushStack(ActionType.Update, {
        before: { nodes: [this.stackData] },
        after: { nodes: [getStackData(this.item)] },
      });
    }
  },
};

G6.registerBehavior(BehaviorType.DragResizeNode, behavior);
