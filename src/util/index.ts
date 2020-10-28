import { ItemType, ItemState } from '@/constant';

import { Graph } from '@antv/g6';
import { IPoint, Item } from '@antv/g6/lib/types';
import { INode, IEdge, IItemBase } from '@antv/g6/lib/interface/item';

import { INodeStack, IEdgeStack } from '@/interface';

export * from './graph';
export * from './history';
export * from './labelEditor';
export * from './line';
export * from './polyline';
export * from './tooltip';
export * from './zoom';

/** 生成唯一id */
export const guid = () => {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
/**
 * 获取两点间直线距离
 * @param {object} point1 点位1
 * @param {object} point2 点位2
 */
export const getDistance = (point1: IPoint, point2: IPoint) => {
  const left = Math.abs(point1.x - point2.x);
  const top = Math.abs(point1.y - point2.y);
  return Math.sqrt(left * left + top * top);
};

/** 执行批量处理 */
export const executeBatch = (graph: Graph, execute: () => void) => {
  const autoPaint = graph.get('autoPaint');

  graph.setAutoPaint(false);

  execute();

  graph.paint();
  graph.setAutoPaint(autoPaint);
};

/** 判断是否节点 */
export const isNode = (item: IItemBase) => {
  return item.getType() === ItemType.Node;
};

/** 判断是否边线 */
export const isEdge = (item: IItemBase) => {
  return item.getType() === ItemType.Edge;
};

/** 获取选中节点 */
export const getSelectedNodes = (graph: Graph) => {
  return graph.findAllByState(ItemType.Node, ItemState.Selected);
};

/** 获取选中边线 */
export const getSelectedEdges = (graph: Graph) => {
  return graph.findAllByState(ItemType.Edge, ItemState.Selected);
};

/** 清除选中状态 */
export const clearSelectedState = (
  graph: Graph,
  shouldUpdate: (item: IItemBase) => boolean = () => true,
) => {
  const selectedNodes = getSelectedNodes(graph);
  const selectedEdges = getSelectedEdges(graph);

  executeBatch(graph, () => {
    [...selectedNodes, ...selectedEdges].forEach(item => {
      if (shouldUpdate(item)) {
        graph.setItemState(item, ItemState.Selected, false);
      }
    });
  });
};

/**
 * 获取流程图回溯路径
 * @param {object} graph 图
 * @param {object} node 节点
 * @param {array} targetIds 目标id
 * @param {array} edges 边
 */
export function getFlowRecallEdges(
  graph: Graph,
  node: INode,
  targetIds: string[] = [],
  edges: IEdge[] = [],
) {
  const inEdges = node.getInEdges();

  if (!inEdges.length) {
    return [];
  }

  inEdges.map((edge: IEdge) => {
    const sourceId = edge.getModel().source as string;
    const sourceNode = graph.findById(sourceId) as INode;

    edges.push(edge);

    const targetId = node.get('id');

    targetIds.push(targetId);

    if (!targetIds.includes(sourceId)) {
      getFlowRecallEdges(graph, sourceNode, targetIds, edges);
    }
  });

  return edges;
}

/**
 * 获取图元素推入堆栈必要的数据
 * @param {object} item 图元素
 */
export const getStackData = (item: Item): INodeStack | IEdgeStack => {
  const itemType = item.getType();

  const data = {
    ...item.getModel(),
    itemType,
  };

  return data;
};

/**
 * 移除所有的组合
 * @param {object} graph 图实例
 */
export const removeAllCombo = (graph: Graph) => {
  graph.getCombos().forEach(combo => {
    graph.uncombo(combo);
  });
};
