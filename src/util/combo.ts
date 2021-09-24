import { ICombo } from '@antv/g6/lib/interface/item';
import { Instance } from '@/index';
import { COMBO_CONTROL_NAME } from '@/constant';

/** 当前是否有成组 */
export const getCombo = () => {
  return Instance.graph.getCombos()[0];
};

/**
 * 移除combo控制节点
 */
export const removeComboControl = () => {
  const group = Instance.graph.getGroup();
  const shapes = group.findAllByName(COMBO_CONTROL_NAME);
  shapes.forEach((shape) => group.removeChild(shape));
};

export const getUpdateModel = (
  item: ICombo,
  index: number,
  isCenter: boolean = false,
) => {
  const { width: oWidth = 0, height: oHeight = 0 } = item.getOriginStyle();
  let { x: oX = 0, y: oY = 0 } = item.getModel();
  const originPoints = [
    [0.5, 0.5],
    [-0.5, 0.5],
    [0.5, -0.5],
    [-0.5, -0.5],
  ];

  oX += oWidth * originPoints[index][0] + 1;
  oY += oHeight * originPoints[index][1] + 1;

  const nodes = item.getNodes();

  const nodeMaps = nodes.map((node) => {
    const model = node.getModel();
    return {
      ...model,
    };
  });

  const points = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];

  const point = points[index];

  return (offsetX: number, offsetY: number) => {
    /** 实际偏移量-x轴 */
    const aOffsetX = (point[0] || -1) * offsetX;

    /** 实际偏移量-y轴 */
    const aOffsetY = (point[1] || -1) * offsetY;

    const offsetRatioX = aOffsetX / oWidth;
    const offsetRatioY = aOffsetY / oHeight;

    return nodeMaps.map((model) => {
      const { x = 0, y = 0 } = model;
      const size = (model.size || [0, 0]) as number[];

      return {
        size: [size[0] * (1 + offsetRatioX), size[1] * (1 + offsetRatioY)],
        x: oX + (x - oX) * (1 + offsetRatioX),
        y: oY + (y - oY) * (1 + offsetRatioY),
      };
    });
  };
};
