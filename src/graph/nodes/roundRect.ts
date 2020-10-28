import G6 from '@antv/g6';
import { NodeType } from '@/constant';

const bizFlowNode = {
  getCustomConfig() {
    return {
      size: [120, 60],
      wrapperStyle: {
        radius: 8,
      },
    };
  },
};

G6.registerNode(NodeType.FlowRoundRect, bizFlowNode, NodeType.FlowRect);
