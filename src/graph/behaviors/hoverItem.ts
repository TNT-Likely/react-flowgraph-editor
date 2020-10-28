import G6 from '@antv/g6';
import { ItemState, BehaviorType } from '@/constant';

import { Graph } from '@antv/g6';
import { BehaviorOption, Item } from '@antv/g6/lib/types';
import { IBehaviorOption } from '@/interface';
import { INode, IItemBase } from '@antv/g6/lib/interface/item';
import { G6GraphEvent } from '@antv/g6/lib/interface/behavior';

const hoverItemBehavior: IBehaviorOption = {
  graph: {} as Graph,
  getEvents() {
    return {
      'node:mouseenter': 'handleItemMouseenter',
      'edge:mouseenter': 'handleItemMouseenter',
      'node:mouseleave': 'handleItemMouseleave',
      'edge:mouseleave': 'handleItemMouseleave',
    };
  },

  handleItemMouseenter(e: G6GraphEvent) {
    if (!e.item) return;

    const { graph } = this;

    graph.setItemState(e.item, ItemState.Active, true);
  },

  handleItemMouseleave(e: G6GraphEvent) {
    const { graph } = this;

    graph.setItemState(e.item, ItemState.Active, false);
  },
};

G6.registerBehavior(BehaviorType.HoverItem, hoverItemBehavior);
