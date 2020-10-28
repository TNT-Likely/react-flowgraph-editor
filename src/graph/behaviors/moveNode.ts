import G6 from '@antv/g6';
import {
  BehaviorType,
  ANCHOR_POINT_NAME,
  CONTROL_POINT_NAME,
  ItemState,
  ItemType,
  ActionType,
} from '@/constant';
import { Instance } from '../..';
import Snapline from '../common/snapline';
import {
  getStackData,
  clearSelectedState,
  showTooltip,
  hideTooltip,
} from '@/util';

const sLine = new Snapline();

import { Graph } from '@antv/g6';
import {
  IBehaviorOption,
  IEdgeStack,
  INodeEvent,
  INodeStack,
  IStackData,
  IStackDatas,
} from '@/interface';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { IPoint, Item, IG6GraphEvent } from '@antv/g6/lib/types';
import { INode, IEdge } from '@antv/g6/lib/interface/item';

interface IMoveNode extends IBehaviorOption {
  draging: boolean;
  nodes: INode[];
  edges: IEdge[];
  origin: IPoint;
  points: IPoint[];
}

const behavior: IMoveNode = {
  graph: {} as Graph,
  draging: false,
  nodes: [],
  edges: [],
  origin: { x: 0, y: 0 },
  points: [],

  getEvents() {
    return {
      'node:dragstart': 'handleNodeDragStart',
      'node:drag': 'handleNodeDrag',
      'node:dragend': 'handleNodeDragend',
    };
  },

  handleNodeDragStart({ item, target, x, y }: IG6GraphEvent) {
    const { graph } = this;

    if (!item || item.destroyed) {
      return;
    }

    const name = target.get('name');

    if ([ANCHOR_POINT_NAME, CONTROL_POINT_NAME].includes(name)) {
      return;
    }

    if (!this.draging) {
      graph.setItemState(item, ItemState.Selected, true);

      this.draging = true;
      this.origin = { x, y };
      this.nodes = graph.findAllByState(ItemType.Node, ItemState.Selected);
      const edges = this.nodes.reduce((ac, cur) => {
        cur.getEdges().forEach(edge => {
          ac[edge.getID() as string] = edge;
        });
        return ac;
      }, {} as any);
      this.edges = Object.keys(edges).map(edgeId => edges[edgeId]);
      this.points = this.nodes.reduce((ac, cur) => {
        const model = cur.getModel();
        ac[model.id || ''] = {
          x: model.x,
          y: model.y,
        };
        return ac;
      }, {} as any);

      const beforeData: IStackData = { nodes: [], edges: [], combos: [] };
      this.nodes.forEach((node: INode) => {
        beforeData.nodes.push(getStackData(node) as INodeStack);
      });
      this.edges.forEach(edge => {
        beforeData.edges.push(getStackData(edge));
      });
      this.beforeData = beforeData;

      this.edges.forEach(edge => {
        graph.updateItem(edge, { nowPath: null }, false);
      });
    }

    sLine.start(graph);
  },

  handleNodeDrag({ item, x, y }: INodeEvent) {
    if (this.draging && item) {
      const { graph, origin, nodes, edges, points } = this;
      const id = item.getID();
      const otherNodes = nodes.filter(node => node.getID() !== id);
      const offsetX = x - origin.x;
      const offsetY = y - origin.y;

      nodes.forEach(node => {
        const nodeId: any = node.getID();
        const model = points[nodeId];
        const position = {
          x: model.x + offsetX,
          y: model.y + offsetY,
        };

        graph.updateItem(node, position, false);
      });

      /** 如果是多选，手动更新edge的path */
      if (otherNodes.length > 0) {
      }
    }

    showTooltip(`X:${Math.floor(x)}  Y:${Math.floor(y)}`, <INode>item);

    if (this.nodes.length === 1) {
      sLine.move(item);
    }
  },

  handleNodeDragend({ item }: IG6GraphEvent) {
    if (this.draging && item) {
      const { graph, beforeData } = this;
      const afterData: IStackData = { nodes: [], edges: [], combos: [] };
      this.nodes.forEach(node => {
        afterData.nodes.push(getStackData(node) as INodeStack);
      });
      this.edges.forEach(edge => {
        afterData.edges.push(getStackData(edge));
      });

      const stackDatas = {
        before: beforeData,
        after: afterData,
      };

      graph.pushStack(ActionType.Update, stackDatas);

      graph.setItemState(item, ItemState.Selected, false);
      this.draging = false;
      this.nodes = [];
      this.edges = [];
      this.points = [];
      this.beforeData = null;
    }

    hideTooltip();
    sLine.end();
  },
};

G6.registerBehavior(BehaviorType.MoveNode, behavior);
