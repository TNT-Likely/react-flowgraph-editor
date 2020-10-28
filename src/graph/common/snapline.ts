import {
  getNodeModel,
  removeLine,
  drawLine,
  toggleLine,
  alignTwoNodes,
} from '@/util';

import { Graph } from '@antv/g6';
import { INode } from '@antv/g6/lib/interface/item';

import {
  IDirection,
  ILineNodeConfig,
  INodeStack,
  TLineAlignType,
} from '@/interface';

const directions: TLineAlignType[] = ['left', 'middle', 'right'];

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
    const tNodes = nodeMaps.filter(map => map.id !== id);

    tNodes.forEach(tNode => {
      directions.forEach(dire => {
        this.checkLine(item, sNode, tNode, dire, 'x');
        this.checkLine(item, sNode, tNode, dire, 'y');
      });
    });
  }

  /** 拖拽结束 */
  end() {
    removeLine('x');
    removeLine('y');
  }

  checkLine(
    item: INode,
    sNode: ILineNodeConfig,
    tNode: ILineNodeConfig,
    dire: TLineAlignType,
    key: IDirection,
  ) {
    const lineId = `${sNode.id}_${tNode.id}_${dire}_${key}`;
    const result = this.calcPosValuesSingle(dire, item, tNode, key);

    if (result.near) {
      const linePos = result.value;
      drawLine(key, linePos, lineId);
      alignTwoNodes(sNode, tNode, dire, result.type, key);
      // console.log('对齐', key, result.dist, result.type, dire, linePos)
    } else {
      toggleLine(lineId);
    }
  }

  calcPosValuesSingle(
    dire: TLineAlignType,
    sNode: INode,
    tNode: ILineNodeConfig,
    key: IDirection,
  ) {
    const target = getNodeModel(sNode);

    const posIndex = key === 'x' ? 0 : 1;

    const result = {
      near: false,
      dist: -1,
      type: '' as TLineAlignType,
      value: 0,
    };

    const models = directions
      .map(type => {
        return {
          type,
          dist: Math.abs(target[type][posIndex] - tNode[dire][posIndex]),
        };
      })
      .sort((a, b) => a.dist - b.dist)[0];

    if (models.dist < 5) {
      result.dist = models.dist;
      result.near = true;
      result.type = models.type;
      result.value = tNode[dire][posIndex];
    }

    return result;
  }
}

export default snapline;
