import { getDistance } from '@/util';

import { Graph } from '@antv/g6';
import { IGroup } from '@antv/g-base/lib/interfaces';
import { IPoint } from '@antv/g6/lib/types';

const BOX_NAME = 'anchor_box';
const BOX_STYLE = {
  lineWidth: 1,
  fill: '#ff8406',
  r: 16,
  opacity: 0.2,
};

const THRESHOID_VALUE = 10;

class AnchorBox {
  graph = {} as Graph;
  group = {} as IGroup;
  points = [] as IPoint[];
  constructor() {}

  /**
   * 开始移动边
   * @param {object} graph 图实例
   * @param {string} sourceNodeId 过滤的节点id
   */
  start(graph: Graph, filterNodeId: string = '0') {
    this.graph = graph;
    this.group = graph.getGroup();
    this.points = graph
      .getNodes()
      .filter(node => node.getID() !== filterNodeId)
      .reduce((ac, node) => {
        const anchorPoints = (node.getAnchorPoints() as any).map(
          (point: IPoint) => ({
            ...point,
            id: node.getID(),
          }),
        );
        return ac.concat(...anchorPoints);
      }, []);
  }

  /**
   * 边在移动
   * @param {number} x 横坐标
   * @param {number} y 纵坐标
   */
  move(x: number, y: number) {
    const result = this.points.find(point => {
      const distance = getDistance(point, { x, y });
      if (distance < THRESHOID_VALUE) {
        // console.log('靠近', point)
        this.drawBox(point);
        return true;
      } else {
        this.hideBox(point);
        return false;
      }
    });
    return result;
  }

  /**
   * 边停止移动
   */
  end() {
    const shapes = this.group.findAllByName(BOX_NAME);
    shapes.forEach(shape => {
      this.group.removeChild(shape);
    });
  }

  /**
   * 根据点位获取Id
   * @param {object} point 点位
   */
  getIdByPoint(point: IPoint) {
    return `${point.id}_${point.index}`;
  }

  /**
   * 根据点位获取图形
   * @param {object} point 点位
   */
  getShapeByPoint(point: IPoint) {
    return this.group.findById(this.getIdByPoint(point));
  }

  /**
   * 绘制锚点外围盒子
   * @param {object} point 点位
   */
  drawBox(point: IPoint) {
    const { group } = this;
    const id = this.getIdByPoint(point);
    const shape = group.findById(id);

    const attrs = {
      ...point,
      ...BOX_STYLE,
    };

    if (!shape) {
      group.addShape('circle', {
        name: BOX_NAME,
        id,
        attrs,
      });
    } else {
      shape.attr(attrs);
    }
  }

  /**
   * 影藏锚点外围盒子
   * @param {object} point 点位
   */
  hideBox(point: IPoint) {
    const shape = this.getShapeByPoint(point);
    if (shape) {
      shape.attr({
        opacity: 0,
      });
    }
  }
}

export default AnchorBox;
