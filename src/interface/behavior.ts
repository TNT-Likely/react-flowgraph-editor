import { Graph } from '@antv/g6';

import { BehaviorOption } from '@antv/g6/lib/types';

export interface IBehaviorOption extends BehaviorOption {
  graph: Graph;
}
