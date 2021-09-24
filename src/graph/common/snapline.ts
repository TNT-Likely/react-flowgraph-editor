import {
  getNodeModel,
  removeLine,
  drawLine,
  toggleLine,
  alignTwoNodes,
} from '@/util';
import { LineAlignType } from '@/constant';

import { Graph } from '@antv/g6';
import { INode } from '@antv/g6/lib/interface/item';

import {
  IDirection,
  ILineNodeConfig,
  INodeStack,
  TLineAlignType,
  ILineResult,
  TDirection,
} from '@/interface';

interface IPosDirection {
  [index: string]: TDirection;
}

const directions: TLineAlignType[] = Object.values(LineAlignType);
const DIRECTION: IPosDirection = {
  X: 'x',
  Y: 'y',
};
class snapline {
  nodeMaps: ILineNodeConfig[] = [];

  constructor() {}

  /**
   * 开始拖拽
   * @param {object} graph 图实例
   */
  start(graph: Graph) {
    const nodes = graph.getNodes();
    const nodeMaps = nodes.map(getNodeModel);
    this.nodeMaps = nodeMaps;
  }

  /**
   * 拖拽中
   * @param {*} item 拖拽中的节点
   */
  move(item: INode) {
    const { nodeMaps } = this;
    const id = item.getID();
    const sNode = getNodeModel(item);
    const tNodes = nodeMaps.filter((map) => map.id !== id);

    const lineX: ILineResult[] = [];
    const lineY: ILineResult[] = [];
    tNodes.forEach((tNode) => {
      directions.forEach((tDire) => {
        lineX.push(this.checkLine(item, sNode, tNode, tDire, DIRECTION.X));
        lineY.push(this.checkLine(item, sNode, tNode, tDire, DIRECTION.Y));
      });
    });

    this.drawLine(lineX);
    this.drawLine(lineY);
  }

  /**
   * 绘制对齐线
   * @param data 比对结果
   */
  drawLine(data: ILineResult[]) {
    this.sortResult(data).forEach(
      ({ lineId, near, tNode, sNode, tDire, sDire, key, value }, index) => {
        if (near && index === 0) {
          drawLine(key, value, lineId);
          alignTwoNodes(sNode, tNode, tDire, sDire, key);
          // console.log('对齐', key, sDire, tDire, value)
        } else {
          toggleLine(lineId, false);
        }
      },
    );
  }

  /**
   * 排序比对结果
   * @param data
   */
  sortResult(data: ILineResult[]) {
    return data.sort((a, b) => {
      /** 先比较是否在阈值内 */
      if (!a.near && b.near) {
        return 1;
      }

      /** 再根据距离排序 */
      if (a.dist !== b.dist) {
        return a.dist - b.dist;
      }

      /** 如果距离也一样，有限对齐中间 */
      if (
        a.sDire !== LineAlignType.MIDDLE &&
        b.sDire === LineAlignType.MIDDLE
      ) {
        return 1;
      } else if (
        a.sDire === LineAlignType.MIDDLE &&
        b.sDire !== LineAlignType.MIDDLE
      ) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  /** 拖拽结束 */
  end() {
    removeLine(DIRECTION.X);
    removeLine(DIRECTION.y);
  }

  checkLine(
    item: INode,
    sNode: ILineNodeConfig,
    tNode: ILineNodeConfig,
    tDire: TLineAlignType,
    key: IDirection,
  ) {
    const lineId = `${sNode.id}_${tNode.id}_${tDire}_${key}`;
    const result = this.calcPosValuesSingle(tDire, item, tNode, key);
    return {
      ...result,
      tNode,
      sNode,
      tDire,
      key,
      lineId,
    };
  }

  calcPosValuesSingle(
    tDire: TLineAlignType,
    sNode: INode,
    tNode: ILineNodeConfig,
    key: IDirection,
  ) {
    const target = getNodeModel(sNode);

    const posIndex = key === DIRECTION.X ? 0 : 1;

    const result = {
      near: false,
      dist: -1,
      sDire: '' as TLineAlignType,
      value: 0,
    };

    const models = directions
      .map((sDire) => {
        return {
          sDire,
          dist: Math.abs(target[sDire][posIndex] - tNode[tDire][posIndex]),
        };
      })
      .sort((a, b) => a.dist - b.dist)[0];

    if (models.dist < 5) {
      result.near = true;
    }
    result.dist = models.dist;
    result.value = tNode[tDire][posIndex];
    result.sDire = models.sDire;

    return result;
  }
}

export default snapline;
