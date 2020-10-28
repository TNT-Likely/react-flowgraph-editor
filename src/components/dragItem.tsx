import React from 'react';

import { Instance } from '@/index';
import { getStackData } from '@/util';
import { ActionType } from '@/constant';
import Snapline from '@/graph/common/snapline';

import { INode } from '@antv/g6/lib/interface/item';

import { IDragItemProps, TDragItemMouseEvent } from '@/interface';

const sLine = new Snapline();

export class DragItem extends React.PureComponent<IDragItemProps> {
  node = {} as INode;

  /** 拖拽之前的数据 */
  beforeData = {};

  constructor(props: IDragItemProps) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { className, style, children } = this.props;

    return (
      <div
        className={className}
        style={style}
        onMouseDown={this.handleMouseDown}
      >
        {children}
      </div>
    );
  }

  /** 鼠标按下 */
  handleMouseDown = (e: TDragItemMouseEvent) => {
    if (Instance.editable) {
      this.beforeData = Instance.getData();
      this.node = Instance.addNode(this.props.type);
      sLine.start(Instance.graph);
      this.handleMouseMove(e);
      document.addEventListener('mousemove', this.handleMouseMove);
      /** 鼠标松开移除事件监听 */
      document.addEventListener('mouseup', this.handleMouseUp);
    }
  };

  /** 鼠标移动去位移 */
  handleMouseMove = (e: TDragItemMouseEvent) => {
    const { x, y } = this.getPosition(e);
    Instance.moveNode(this.node, x, y);
    sLine.move(this.node);
  };

  /** 鼠标松开 */
  handleMouseUp = () => {
    const stackData = getStackData(this.node);
    Instance.graph.pushStack(ActionType.Add, {
      before: {},
      after: {
        nodes: [stackData],
      },
    });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    sLine.end();
  };

  /**
   * 获取实际画布中的位置
   * @param {object} e 事件句柄
   */
  getPosition = (e: TDragItemMouseEvent) => {
    const { x, y } = Instance.calculatePosition(e.clientX, e.clientY);
    const { width, height } = this.node.getBBox();

    return {
      x: x - 0.5 * width,
      y: y - 0.5 * height,
    };
  };
}
