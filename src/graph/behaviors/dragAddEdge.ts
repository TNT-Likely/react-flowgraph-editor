import G6 from '@antv/g6';
import isPlainObject from 'lodash/isPlainObject';
import { guid, getStackData } from '@/util';
import {
  ItemType,
  ItemState,
  AnchorPointState,
  BehaviorType,
  EdgeType,
  ActionType,
} from '@/constant';
import AnchorBox from '../common/anchorBox';
import { Instance } from '../..';

import { Graph } from '@antv/g6';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';
import { INode } from '@antv/g6/lib/interface/item';
import { IPoint } from '@antv/g6/lib/types';

const aBox = new AnchorBox();

const dragAddEdgeBehavior: any = {
  edge: null,

  graphType: 'flow',

  getDefaultCfg() {
    return {
      edgeType: EdgeType.FlowEdge,
      getAnchorPointStateOfSourceNode: () => AnchorPointState.Enabled,
      getAnchorPointStateOfTargetNode: () => AnchorPointState.Enabled,
    };
  },

  getEvents() {
    return {
      'node:mouseenter': 'handleNodeMouseEnter',
      'node:mouseleave': 'handleNodeMouseLeave',
      'node:mousedown': 'handleNodeMouseDown',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  isEnabledAnchorPoint(e: G6GraphEvent) {
    const { target } = e;
    return (
      !!target.get('isAnchorPoint') &&
      target.get('anchorPointState') === AnchorPointState.Enabled
    );
  },

  isNotSelf(e: G6GraphEvent) {
    const { edge } = this;
    const { item } = e;

    return item.getModel().id !== edge.getSource().getModel().id;
  },

  getTargetNodes(sourceId: string) {
    const { graph } = this;

    const nodes = graph.getNodes();

    return nodes.filter((node: INode) => node.getModel().id !== sourceId);
  },

  canFindTargetAnchorPoint(e: G6GraphEvent) {
    return this.isEnabledAnchorPoint(e) && this.isNotSelf(e);
  },

  shouldAddDelegateEdge(e: G6GraphEvent) {
    return this.isEnabledAnchorPoint(e);
  },

  shouldAddRealEdge() {
    const { edge } = this;

    const target = edge.getTarget();

    return !isPlainObject(target);
  },

  handleNodeMouseEnter(e: G6GraphEvent) {
    const { graph, getAnchorPointStateOfSourceNode } = this;

    const sourceNode = e.item as INode;
    const sourceAnchorPoints = sourceNode.getAnchorPoints();
    const sourceAnchorPointsState: boolean[] = [];

    sourceAnchorPoints.forEach((sourceAnchorPoint: IPoint | number[]) => {
      sourceAnchorPointsState.push(
        getAnchorPointStateOfSourceNode(sourceNode, sourceAnchorPoint),
      );
    });

    sourceNode.set('anchorPointsState', sourceAnchorPointsState);

    graph.setItemState(sourceNode, ItemState.ActiveAnchorPoints, true);
  },

  handleNodeMouseLeave(e: G6GraphEvent) {
    const { graph, edge } = this;
    const { item } = e;

    if (!edge) {
      item.set('anchorPointsState', []);
      graph.setItemState(item, ItemState.ActiveAnchorPoints, false);
    }
  },

  handleNodeMouseDown(e: G6GraphEvent) {
    if (!this.shouldBegin(e) || !this.shouldAddDelegateEdge(e)) {
      return;
    }

    const { graph, edgeType, getAnchorPointStateOfTargetNode } = this;
    const { target } = e;

    const sourceNode = e.item as INode;
    const sourceNodeId = sourceNode.getModel().id;
    const sourceAnchorPointIndex = target.get('anchorPointIndex');
    const sourceAnchorPoint = sourceNode.getAnchorPoints()[
      sourceAnchorPointIndex
    ];

    aBox.start(graph, sourceNodeId);

    const model = {
      id: guid(),
      type: edgeType,
      source: sourceNodeId,
      sourceAnchor: sourceAnchorPointIndex,
      target: {
        x: e.x,
        y: e.y,
      },
    };

    this.edge = graph.addItem(ItemType.Edge, model, false);

    graph.getNodes().forEach((targetNode: INode) => {
      if (targetNode.getModel().id === sourceNodeId) {
        return;
      }

      const targetAnchorPoints = targetNode.getAnchorPoints();
      const targetAnchorPointsState: IPoint[] = [];

      targetAnchorPoints.forEach((targetAnchorPoint: IPoint | number[]) => {
        targetAnchorPointsState.push(
          getAnchorPointStateOfTargetNode(
            sourceNode,
            sourceAnchorPoint,
            targetNode,
            targetAnchorPoint,
          ),
        );
      });

      targetNode.set('anchorPointsState', targetAnchorPointsState);

      graph.setItemState(targetNode, ItemState.ActiveAnchorPoints, true);
    });
  },

  handleMouseMove(e: G6GraphEvent) {
    const { graph, edge } = this;

    if (!edge) {
      return;
    }

    const result = aBox.move(e.x, e.y);
    if (result) {
      const targetId = result.id;
      const targetAnchor = result.index;
      graph.updateItem(
        edge,
        {
          target: targetId,
          targetAnchor,
        },
        false,
      );
    } else {
      graph.updateItem(
        edge,
        {
          target: {
            x: e.x,
            y: e.y,
          },
          targetAnchor: undefined,
        },
        false,
      );
    }
  },

  handleMouseUp() {
    const { edge } = this;
    const graph = this.graph as Graph;

    if (!edge) {
      return;
    }

    aBox.end();

    if (!this.shouldAddRealEdge()) {
      graph.removeItem(this.edge, false);
    } else {
      /** 添加边成功后，推入堆栈 */
      graph.pushStack(ActionType.Add, {
        before: {},
        after: {
          edges: [getStackData(edge)],
        },
      });
    }

    this.edge = null;

    graph.getNodes().forEach(node => {
      node.set('anchorPointsState', []);
      graph.setItemState(node, ItemState.ActiveAnchorPoints, false);
    });
  },
};

G6.registerBehavior(BehaviorType.DragAddEdge, dragAddEdgeBehavior);
