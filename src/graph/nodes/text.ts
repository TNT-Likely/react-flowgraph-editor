import G6 from '@antv/g6';
import { NodeType } from '@/constant';

const bizFlowNode = {
  getCustomConfig() {
    return {
      size: [120, 50],
      wrapperStyle: {
        lineWidth: 0,
        fill: 'transparent',
      },
    };
  },
};

G6.registerNode(NodeType.FlowText, bizFlowNode, NodeType.FlowRect);
