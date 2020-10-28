import G6 from '@antv/g6';
import {
  BehaviorType,
  DRAGLINE_NAME,
  DRAGLINE_INDEX,
  ActionType,
} from '@/constant';
import { getStackData } from '@/util';

import { Graph } from '@antv/g6';
import {
  IBehaviorOption,
  IEdgeStack,
  IStackData,
  IEdgeEvent,
} from '@/interface';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { IG6GraphEvent, IPoint, Item } from '@antv/g6/lib/types';
import { INode, IEdge } from '@antv/g6/lib/interface/item';

interface IMovePolyline extends IBehaviorOption {
  moving: boolean;
  beforeData?: string;
  edge?: IEdge;
  nowPath?: number[][];
  pathIndex: number;
}

const behavior: IMovePolyline = {
  graph: {} as Graph,
  moving: false,
  pathIndex: 0,
  getEvents() {
    return {
      'edge:mousedown': 'handleEdgeMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  handleEdgeMouseDown({ target, item }: IEdgeEvent) {
    const name = target.get('name');

    if (name === DRAGLINE_NAME && !this.moving) {
      this.beforeData = JSON.stringify(getStackData(item));

      const keyShape = item.getKeyShape();
      this.moving = true;
      this.edge = item;
      this.nowPath = keyShape.attr('path');
      this.pathIndex = target.get(DRAGLINE_INDEX);
      this.isX = target.attr('cursor') === 'ew-resize';
    }
  },

  handleMouseMove({ x, y }: IEdgeEvent) {
    const { edge, graph, nowPath, moving, pathIndex, isX } = this;
    if (moving && edge && nowPath) {
      const posIndex = isX ? 1 : 2;
      const posValue = isX ? x : y;

      nowPath[pathIndex][posIndex] = posValue;
      nowPath[pathIndex + 1][posIndex] = posValue;

      graph.updateItem(edge, { nowPath }, false);
    }
  },

  handleMouseUp() {
    const { graph, nowPath, beforeData } = this;

    if (this.moving) {
      const parseBeforeData = JSON.parse(beforeData || '');

      if (JSON.stringify(parseBeforeData.nowPath) !== JSON.stringify(nowPath)) {
        const stackDatas = {
          before: { edges: [{ ...parseBeforeData }] },
          after: { edges: [{ ...parseBeforeData, nowPath }] },
        };

        graph.pushStack(ActionType.Update, stackDatas);
      }

      this.moving = false;
      this.edge = undefined;
      this.nowPath = undefined;
    }
  },
};

G6.registerBehavior(BehaviorType.MovePolyline, behavior);
