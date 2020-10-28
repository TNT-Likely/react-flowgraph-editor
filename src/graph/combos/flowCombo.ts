import G6 from '@antv/g6';
import { ComboType } from '@/constant';

G6.registerCombo(
  ComboType.FlowCombo,
  {
    options: {
      padding: [0, 0, 0, 0],
      style: {
        lineWidth: 2,
        stroke: '#fa3246',
      },
    },
  },
  ComboType.Rect,
);
