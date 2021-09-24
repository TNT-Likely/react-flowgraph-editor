import G6 from '@antv/g6';
import { NodeType } from '@/constant';

const bizFlowNode = {
  getCustomConfig() {
    return {
      size: [120, 50],
      wrapperStyle: {
        radius: 24,
      },
    };
  },
};

G6.registerNode(NodeType.FlowRoundRect, bizFlowNode, NodeType.FlowRect);
