import React, { PureComponent } from 'react';
import G6, { Graph } from '@antv/g6';
import {
  PrefixCls,
  DefaultBehaviors,
  NodeType,
  ItemType,
  ItemState,
  EdgeType,
  ComboType,
  GraphCustomEvent,
  ActionType,
} from '@/constant';
import { guid, undo, redo } from '@/util';

import { IGraph } from '@antv/g6/lib/interface/graph';
import { INode, IItemBase, IEdge } from '@antv/g6/lib/interface/item';
import { GraphData, GraphOptions, ITEM_TYPE } from '@antv/g6/lib/types';
import {
  IEditorProps,
  IInstance,
  ISelectedItems,
  IItemStack,
  IStackData,
  IStackDatas,
  IEdgeStack,
} from '@/interface';

export const Instance = {} as IInstance;

class FlowEditor extends PureComponent<IEditorProps> {
  graph: Graph = {} as Graph;
  containerId = guid();
  copyData: ISelectedItems = { nodes: new Set(), edges: new Set() };

  static defaultProps = {
    width: 1200,
    height: 600,
    ratio: 1,
    editable: true,
    behaviors: [],
  };

  state = {
    editable: this.props.editable,
  };

  constructor(props: IEditorProps) {
    super(props);
    Instance.editable = props.editable;
    Instance.addNode = this.addNode.bind(this);
    Instance.moveNode = this.moveNode.bind(this);
    // Instance.getClientRect = this.getClientRect.bind(this)
    // Instance.toggleEditable = this.toggleEditable.bind(this)
    Instance.getData = this.getData.bind(this);
    Instance.changeData = this.changeData.bind(this);
    Instance.calculatePosition = this.calculatePosition.bind(this);
    Instance.changeZoom = this.changeZoom.bind(this);
    Instance.undo = this.undo.bind(this);
    Instance.redo = this.redo.bind(this);
    Instance.deleteSelected = this.deleteSelected.bind(this);
    Instance.copy = this.copy.bind(this);
    Instance.paste = this.paste.bind(this);
  }

  componentDidMount() {
    this.initGraph();
  }

  componentDidUpdate(preProps: IEditorProps) {
    if (this.shouldChangeSize(preProps)) {
      this.changeSize(this.props.width, this.props.height);
    }

    if (this.shouldZoom(preProps)) {
      this.changeZoom(this.props.ratio || 1);
    }

    if (this.shouldChangeData(preProps)) {
      this.changeData(this.props.data);
    }

    if (this.shouldChangeEditable(preProps)) {
      this.toggleEditable(this.props.editable || false);
    }
  }

  componentWillUnmount() {
    this.graph.destroy();
  }

  render() {
    const { style } = this.props;
    const { editable } = this.state;
    const { containerId } = this;

    return (
      <div
        id={containerId}
        className={PrefixCls}
        style={{
          ...style,
          pointerEvents: editable ? 'all' : 'none',
        }}
      ></div>
    );
  }

  initGraph = () => {
    const {
      behaviors,
      width,
      height,
      data,
      ratio = 1,
      grid = false,
    } = this.props;
    const { containerId } = this;

    const plugins = [];
    if (grid) {
      plugins.push(new G6.Grid());
    }

    const graph = new G6.Graph({
      container: containerId,
      width,
      height,
      enabledStack: true,
      maxZoom: 1,
      modes: {
        default: [...DefaultBehaviors],
      },
      defaultNode: {
        type: NodeType.FlowRect,
      },
      defaultEdge: {
        type: EdgeType.FlowEdge,
      },
      defaultCombo: {
        type: ComboType.FlowCombo,
      },
      plugins: [...plugins],
    });

    graph.data(data);
    graph.render();
    graph.on(GraphCustomEvent.onStackChange, this.handleStackChange);
    graph.on(GraphCustomEvent.onNodeselectchange, this.handleSelectedChange);

    Instance.graph = this.graph = graph;
    this.changeZoom(ratio);
  };

  /**
   * 是否应该改变画布大小
   * @param {IEditorProps} preProps 前一个props
   */
  shouldChangeSize = (preProps: IEditorProps) => {
    const { width, height } = this.props;
    return preProps.width !== width || preProps.height !== height;
  };

  /**
   * 改变画布大小
   * @param {number} width 画布宽
   * @param {number} height 画布高
   */
  changeSize = (width: number, height: number) => {
    this.graph.changeSize(width, height);
  };

  /**
   * 是否应该改变缩放比例
   * @param {object} preProps 前一个props
   */
  shouldZoom = (preProps: IEditorProps) => {
    return preProps.ratio !== this.props.ratio;
  };

  /**
   * 缩放画布
   * @param {number} ratio 缩放比例
   */
  changeZoom = (ratio: number, hasCallback?: boolean) => {
    const { onRatioChange } = this.props;
    Instance.ratio = ratio;
    this.graph.zoomTo(ratio);
    if (hasCallback && onRatioChange) {
      onRatioChange(ratio);
    }
  };

  /** 是否应该改变画布数据 */
  shouldChangeData = (preProps: IEditorProps) => {
    return JSON.stringify(preProps.data) !== JSON.stringify(this.props.data);
  };

  /** 是否应该改变画布可编辑属性 */
  shouldChangeEditable = (preProps: IEditorProps) => {
    return preProps.editable !== this.props.editable;
  };

  /**
   * 添加节点
   * @param {string} type 节点类型
   * @param {number} x 横坐标
   * @param {number} y 纵坐标
   * @param {boolean} pushStack 是否推入堆栈
   */
  addNode = (
    type = NodeType.FlowRect,
    x = 100,
    y = 100,
    pushStack = false,
    rest: object = {},
  ) => {
    return this.graph.addItem(
      ItemType.Node,
      {
        id: guid(),
        type,
        x,
        y,
        ...rest,
      },
      pushStack,
    );
  };

  /**
   * 移动节点
   * @param {object} node 节点
   * @param {number} x 横坐标
   * @param {number} y 纵坐标
   */
  moveNode = (node: INode, x: number, y: number) => {
    this.graph?.updateItem(
      node,
      {
        x,
        y,
      },
      false,
    );
  };

  /** 获取客户端信息 */
  getClientRect = () => {
    return this.graph.getContainer().getBoundingClientRect();
  };

  /**
   * 切换是否能够编辑
   * @param {boolean} can 是否可以编辑
   */
  toggleEditable = (can: boolean) => {
    const { editable } = this.state;
    const afterEditable = can !== undefined ? can : !editable;
    return new Promise(resolve => {
      this.setState(
        {
          editable: afterEditable,
        },
        () => {
          Instance.editable = afterEditable;
        },
      );
    });
  };

  /** 获取图数据 */
  getData = () => {
    return this.graph?.save();
  };

  /**
   * 改变图数据
   * @param {GraphData} data 图数据
   */
  changeData = (data: GraphData) => {
    this.graph?.changeData(data, false);
  };

  /**
   * 根据document事件位置计算出画布中的位置
   * @param {number} clientX 客户端x轴坐标
   * @param {number} clientY 客户端y轴坐标
   */
  calculatePosition = (clientX: number, clientY: number) => {
    const { x, y } = this.getClientRect();
    const { ratio } = Instance;
    return {
      x: (clientX - x) / ratio,
      y: (clientY - y) / ratio,
    };
  };

  /** 是否可以进行撤销 */
  canUndo = () => {
    return !!this.graph.getUndoStack().length;
  };

  /** 是否可以进行恢复 */
  canRedo = () => {
    return !!this.graph.getRedoStack().length;
  };

  /** 撤销 */
  undo = () => {
    undo(this.graph);
  };

  /** 恢复 */
  redo = () => {
    redo(this.graph);
  };

  /**
   * 堆栈信息发生改变
   */
  handleStackChange = () => {
    const { onStackChange } = this.props;
    const { undoStack, redoStack } = this.graph.getStackData();

    if (onStackChange) {
      onStackChange({
        canUndo: undoStack.length > 1,
        canRedo: redoStack.length > 0,
      });
    }
  };

  /**
   * 获取图元素推入堆栈必要的数据
   * @param {object} item 图元素
   */
  getStackData = (item: IItemBase): IItemStack => {
    const itemType = item.getType();

    const data = {
      ...item.getModel(),
      itemType,
    };

    return data;
  };

  /** 查找当前选中的元素 */
  findSelected = (): ISelectedItems => {
    const { graph } = this;

    const edges = graph
      .findAllByState(ItemType.Edge, ItemState.Selected)
      .map(edge => edge.getID());
    const nodes = [
      ...graph.findAllByState(ItemType.Node, ItemState.Selected),
      ...graph.findAllByState(ItemType.Combo, ItemState.Selected),
    ].map(node => node.getID());

    /** 查找出节点关联的边 */
    nodes.forEach(id => {
      const linkEdges = (graph.findById(id) as INode).getEdges();
      linkEdges.forEach((edge: IEdge) => {
        edges.push(edge.getID());
      });
    });

    return {
      nodes: new Set(nodes),
      edges: new Set(edges),
    };
  };

  /**
   * 批量操作图元素
   * @param {ISelectedItems} items 图元素列表
   * @param {string} actionType 操作类型
   */
  bulkUpdate = (items: ISelectedItems, actionType: string) => {
    const { graph } = this;
    const { nodes, edges } = items;

    /** 入栈的数据 */
    const stackDatas: IStackDatas = {
      before: { nodes: [], edges: [], combos: [] },
      after: { nodes: [], edges: [], combos: [] },
    };

    /** 复制的占位符id */
    const copyId = `-${Math.floor(Math.random() * 1000)}`;

    /** 复制的元素偏移量 */
    const copyOffset = 50;

    const allItems =
      actionType === ActionType.Add
        ? [...nodes, ...edges]
        : [...edges, ...nodes];

    allItems.forEach(id => {
      const item = graph.findById(id);
      const stackData = this.getStackData(item);
      const itemType = item.getType();

      switch (actionType) {
        case ActionType.Delete:
          stackDatas.before[`${itemType}s`].push(stackData);
          graph.removeItem(item, false);
          break;
        case ActionType.Add:
          stackData.id += copyId;
          if (itemType === ItemType.Edge) {
            stackData.source += copyId;
            stackData.target += copyId;
          } else if (itemType === ItemType.Node) {
            stackData.x = (stackData.x || 0) + copyOffset;
            stackData.y = (stackData.y || 0) + copyOffset;
          }
          stackDatas.after[`${itemType}s`].push({
            ...stackData,
            sourceNode: undefined,
            targetNode: undefined,
          });
          graph.addItem(itemType, stackData, false);
          break;
      }
    });

    !!allItems.length && graph.pushStack(actionType, stackDatas);
  };

  /** 删除选中的元素 */
  deleteSelected = () => {
    const items = this.findSelected();
    this.bulkUpdate(items, ActionType.Delete);
  };

  /** 复制元素 */
  copy = () => {
    this.copyData = this.findSelected();
  };

  /** 粘贴剪切板 */
  paste = () => {
    const items = this.copyData;
    this.bulkUpdate(items, ActionType.Add);
  };

  /** 选择元素发生改变 */
  handleSelectedChange = () => {
    // const { select, selectedItems } = e;
    // const { nodes, edges } = selectedItems;
    // if (select && nodes.length > 1) {
    //   const { nodes } = e.selectedItems;
    //   const nodeIds = nodes.map(node => node.getID());
    //   // this.graph.createCombo({
    //   //     id: guid()
    //   // }, nodeIds)
    // }
  };
}

export default FlowEditor;
