import { ItemState, ItemType } from '@/constant';

import { Graph } from '@antv/g6';
import { Item } from '@antv/g6/lib/types';

/**
 * 清除节点选中状态
 * @param func
 */
export const clearSelected = (graph: Graph, func?: (node: Item) => boolean) => {
  const allNodes = graph.findAllByState(ItemType.Node, ItemState.Selected);
  const nodes = !!func ? allNodes.filter(func) : allNodes;

  nodes.forEach((node) => {
    graph.setItemState(node, ItemState.Selected, false);
  });
};
