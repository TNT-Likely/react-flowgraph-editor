import G6 from '@antv/g6';
import { Instance } from '@/index';
import {
  ComboType,
  Color,
  CONTROL_POINT_NAME,
  COMBO_NAME,
  COMBO_CONTROL_NAME,
} from '@/constant';
import { ICombo } from '@antv/g6/lib/interface/item';
import { ComboConfig, ModelConfig } from '@antv/g6/lib/types';
import GGroup from '@antv/g-canvas/lib/group';

const COMBO_CONTROL_STYLE = {
  lineWidth: 1,
  width: 8,
  height: 8,
  stroke: Color.Base,
  fill: '#fff',
};

G6.registerCombo(
  ComboType.FlowCombo,
  {
    options: {
      padding: 0,
      style: {
        lineWidth: 1,
        stroke: Color.Base,
      },
    },

    drawShape(cfg: ModelConfig, group: GGroup) {
      cfg.padding = cfg.padding || this.options?.padding;
      const padding = cfg.padding as number[];
      const style = this.getShapeStyle(cfg);

      const rect = group.addShape('rect', {
        attrs: {
          ...style,
          x: -style.width / 2 - (padding[3] - padding[1]) / 2,
          y: -style.height / 2 - (padding[0] - padding[2]) / 2,
          width: style.width,
          height: style.height,
          zIndex: 2,
        },
        draggable: true,
        name: COMBO_NAME,
      });

      return rect;
    },

    /** 更新 */
    afterUpdate: function afterUpdate(cfg: ComboConfig, combo: ICombo) {
      this.drawControlPoint(cfg);
      this.removeNodeControlPoints();
    },

    /**
     * 绘制控制点
     * @param cfg
     * @param combo
     */
    drawControlPoint(cfg: ComboConfig) {
      [0, 1, 2, 3].forEach((i) => {
        this.drawSingleControlPoint(cfg, i);
      });
    },

    /**
     * 绘制单个控制点
     * @param cfg
     * @param group
     * @param index
     */
    drawSingleControlPoint(cfg: ComboConfig, index: number) {
      const point = this.getPointByIndex(cfg, index);
      const group = Instance.graph.getGroup();
      const shapes = group.findAllByName(COMBO_CONTROL_NAME);
      const shape =
        shapes[index] ||
        group.addShape('rect', {
          name: COMBO_CONTROL_NAME,
          attrs: {},
        });

      shape.set('index', index);
      shape.set('comboSize', [cfg.style?.width, cfg.style?.height]);
      shape.attr({
        ...COMBO_CONTROL_STYLE,
        x: point[0] - COMBO_CONTROL_STYLE.width * 0.5,
        y: point[1] - COMBO_CONTROL_STYLE.height * 0.5,
        cursor: [0, 3].includes(index) ? 'nwse-resize' : 'nesw-resize',
      });
    },

    /**
     * 获取控制点
     * @param cfg
     * @param index
     */
    getPointByIndex(cfg: ComboConfig, index: number = 0) {
      const {
        x = 0,
        y = 0,
        style: { width, height },
      } = cfg;

      const points = [
        [x - width * 0.5, y - height * 0.5],
        [x + width * 0.5, y - height * 0.5],
        [x - width * 0.5, y + height * 0.5],
        [x + width * 0.5, y + height * 0.5],
      ];

      return points[index];
    },

    removeNodeControlPoints() {
      const group = Instance.graph.getGroup();
      const shapes = group.findAllByName(CONTROL_POINT_NAME);

      shapes.forEach((shape) => {
        shape.attr({
          width: 0,
          height: 0,
        });
      });
    },
  },
  ComboType.Rect,
);
