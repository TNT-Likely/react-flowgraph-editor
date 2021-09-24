import G6 from '@antv/g6';

import { Instance } from '@/index';
import { BehaviorType, ActionType, COMBO_CONTROL_NAME } from '@/constant';
import {
  getStackData,
  getUpdateModel,
  removeComboControl,
  getCombo,
} from '@/util';

import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { INode } from '@antv/g6/lib/interface/item';

const behavior: any = {
  getDefaultCfg() {
    return {};
  },

  getEvents() {
    return {
      mousedown: 'handleComboMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  handleComboMouseDown(e: G6GraphEvent) {
    const { target, item } = e;
    if (!target) return;

    const name = target.get('name');

    if (name === COMBO_CONTROL_NAME && getCombo()) {
      this.isResize = true;
      this.attrs = target.get('canvasBBox');
      this.index = target.get('index');
      this.nodes = getCombo().get('nodes');
      this.beforeData = {
        nodes: this.nodes.map((node: INode) => getStackData(node)),
        edges: [],
        combos: [],
      };
      this.getModels = getUpdateModel(getCombo(), this.index, true);
    }
  },

  handleMouseMove(e: G6GraphEvent) {
    if (this.isResize && getCombo()) {
      const { x, y } = this.attrs;
      const { canvasX, canvasY } = e;
      const { ratio, graph } = Instance;

      const offsetX = (canvasX - x) * ratio;
      const offsetY = (canvasY - y) * ratio;

      const models = this.getModels(offsetX, offsetY);

      this.nodes.forEach((node: INode, index: number) => {
        !node.hasLocked() &&
          graph.updateItem(
            node,
            {
              ...models[index],
            },
            false,
          );
      });

      getCombo() && this.graph.updateCombo(getCombo());
    }

    if (!getCombo()) {
      removeComboControl();
    }
  },

  handleMouseUp() {
    if (this.isResize) {
      this.isResize = false;
      Instance.graph.pushStack(ActionType.Update, {
        before: this.beforeData,
        after: { nodes: this.nodes.map((node: INode) => getStackData(node)) },
      });
    }
  },
};

G6.registerBehavior(BehaviorType.DragResizeCombo, behavior);
