import G6 from '@antv/g6';
import {
  BehaviorType,
  EDGE_START_PLACEHOLDER_NAME,
  EDGE_END_PLACEHOLDER_NAME,
  ANCHOR_POINT_NAME,
  ActionType,
} from '@/constant';
import { getStackData, isEdge } from '@/util';
import AnchorBox from '../common/anchorBox';
import { Instance } from '../..';

const aBox = new AnchorBox();

import { Graph } from '@antv/g6';
import { IBehaviorOption } from '@/interface';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { IG6GraphEvent, IPoint, Item } from '@antv/g6/lib/types';
import { INode, IEdge } from '@antv/g6/lib/interface/item';

interface IMoveEdge extends IBehaviorOption {
  edge?: IEdge;
  moving: string;
}

const behavior: IMoveEdge = {
  graph: {} as Graph,
  edge: {} as IEdge,
  moving: '',
  getEvents() {
    return {
      'edge:mousedown': 'handleEdgeMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  /** 拖动结束 */
  handleMouseUp() {
    const { graph, edge, beforeData, moving } = this;
    if (moving && edge) {
      aBox.end();
      const afterData = getStackData(edge);
      const stackData = {
        before: { edges: [beforeData] },
        after: { edges: [afterData] },
      };

      if (JSON.stringify(beforeData) !== JSON.stringify(afterData)) {
        graph.pushStack(ActionType.Update, stackData);
      }

      this.moving = '';
      this.edge = undefined;
      this.beforeData = null;
    }
  },

  /** 拖动边 */
  handleMouseMove({ x, y, target, item }: IG6GraphEvent) {
    const { graph, edge, moving } = this;
    if (!moving || !edge) {
      return;
    }

    const model: any = {};

    const result = aBox.move(x, y);

    if (result) {
      const targetId = result.id;
      const targetAnchor = result.index;
      model[moving] = targetId;
      model[`${moving}Anchor`] = targetAnchor;
    } else {
      model[moving] = { x, y };
    }

    model.nowPath = null;

    graph.updateItem(edge, model, false);
  },

  /** 开始拖动边 */
  handleEdgeMouseDown(e: IG6GraphEvent) {
    const { target } = e;
    const item = e.item as IEdge;
    const { graph } = this;
    const name = target.get('name');
    const allowNames = [EDGE_START_PLACEHOLDER_NAME, EDGE_END_PLACEHOLDER_NAME];
    const findIndex = allowNames.indexOf(name);
    if (!this.moving && findIndex !== -1 && item) {
      this.edge = item;
      this.beforeData = getStackData(item);
      this.moving = findIndex === 0 ? 'source' : 'target';

      const filterNode = item.get(findIndex === 0 ? 'target' : 'source');
      aBox.start(graph, filterNode);
    }
  },
};

G6.registerBehavior(BehaviorType.DragMoveEdge, behavior);
