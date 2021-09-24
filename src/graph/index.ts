import './load';
import G6, { Graph } from '@antv/g6';

import {
  DefaultBehaviors,
  NodeType,
  ItemType,
  ItemState,
  EdgeType,
  ComboType,
  GraphCustomEvent,
  ActionType,
  CONTROL_POINT_NAME,
  MenuCode,
} from '@/constant';
import {
  guid,
  undo,
  redo,
  getStackData,
  removeComboControl,
  getMenu,
  getCombo,
} from '@/util';
import { drawControlPoints, removeControlPoints } from '@/graph/common/anchor';

import { IGraph } from '@antv/g6/lib/interface/graph';
import { INode, IItemBase, IEdge, ICombo } from '@antv/g6/lib/interface/item';
import {
  GraphData,
  GraphOptions,
  ITEM_TYPE,
  IG6GraphEvent,
  ModelConfig,
  LabelStyle,
} from '@antv/g6/lib/types';
import {
  IEditorProps,
  IInstance,
  ISelectedItems,
  IItemStack,
  IStackData,
  IStackDatas,
  IEdgeStack,
} from '@/interface';

interface IGLobalEvent {
  [index: string]: (value: any) => void;
}

const GLOBAL_EVENT: IGLobalEvent = (window._event = {});
class FlowEditor {
  /** 图实例 */
  graph = {} as Graph;

  /** 当前缩放比例 */
  ratio: number = 1;

  /** 属性 */
  props: IEditorProps = {} as IEditorProps;

  /** 复制的数据 */
  copyData: ISelectedItems = { nodes: new Set(), edges: new Set() };

  /** 是否可编辑 */
  editable: boolean = true;

  constructor(props: IEditorProps) {
    const {
      container,
      data,
      enabledStack = true,
      width = 1200,
      height = 600,
      ratio = 1,
      maxZoom = 10,
      editable = true,
      behaviors = [],
      grid = false,
    } = props;
    const menu = new G6.Menu({
      itemTypes: ['node', 'canvas'],
      getContent(e: IG6GraphEvent) {
        const outDiv = document.createElement('div');
        const menuData = getMenu(e.item as INode);
        outDiv.innerHTML = `<ul>
            ${menuData
              .map(
                (i, index) =>
                  `<li code='${i.code}' ${i.disabled ? 'disabled' : ''}>${
                    i.text
                  }<span>${i.shortcut}</span></li>${
                    index !== menuData.length - 1 ? '<hr />' : ''
                  }`,
              )
              .join('')}
          </ul>`;
        return outDiv;
      },
      handleMenuClick: (target: HTMLLIElement, item: INode) => {
        const code = target.getAttribute('code');
        switch (code) {
          case MenuCode.SelectAll:
            this.selectAll();
            break;
          case MenuCode.Lock:
            this.lock(item);
            break;
          case MenuCode.UnLock:
            this.unlock(item);
            break;
        }
      },
    });
    const plugins = [menu];
    !!grid && plugins.push(new G6.Grid());

    this.props = props;
    this.editable = editable;
    this.graph = new G6.Graph({
      container,
      width,
      height,
      enabledStack,
      plugins,
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
    });

    this.graph.data(data);
    this.graph.render();
    this.graph.on(GraphCustomEvent.onStackChange, this.handleStackChange);
    this.graph.on(
      GraphCustomEvent.onNodeselectchange,
      this.handleSelectedChange,
    );
    this.graph.on(GraphCustomEvent.onNodeClick, this.handleNodeClick);
    this.graph.on(GraphCustomEvent.onEdgeClick, this.handleEdgeClick);
    this.graph.on(GraphCustomEvent.onCanvasClick, this.handleCanvasClick);

    window._graph = this.graph;

    this.changeZoom(ratio);
  }

  /**
   * 改变画布大小
   * @param {number} width 画布宽
   * @param {number} height 画布高
   */
  changeSize(width: number, height: number) {
    this.graph.changeSize(width, height);
  }

  /**
   * 缩放画布
   * @param {number} ratio 缩放比例
   */
  changeZoom(ratio: number, hasCallback: boolean = false) {
    const { onRatioChange } = this.props;
    this.ratio = ratio;
    this.graph.zoomTo(ratio);
    if (onRatioChange) {
      onRatioChange(ratio);
    }
  }

  /**
   * 添加节点
   * @param {string} type 节点类型
   * @param {number} x 横坐标
   * @param {number} y 纵坐标
   * @param {boolean} pushStack 是否推入堆栈
   */
  addNode(
    type = NodeType.FlowRect,
    x = 100,
    y = 100,
    pushStack = false,
    rest: object = {},
  ) {
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
  }

  /**
   * 移动节点
   * @param {object} node 节点
   * @param {number} x 横坐标
   * @param {number} y 纵坐标
   */
  moveNode(node: INode, x: number, y: number) {
    this.graph.updateItem(
      node,
      {
        x,
        y,
      },
      false,
    );
  }

  /** 获取客户端信息 */
  getClientRect() {
    return this.graph.getContainer().getBoundingClientRect();
  }

  /**
   * 移除数据中的souceNode,targetNode
   * @param data
   */
  fixData = (data: GraphData = {}) => {
    data.edges = (data.edges || []).map((val: IEdge) => {
      return {
        ...val,
        sourceNode: null,
        targetNode: null,
      };
    });
    return data;
  };

  /** 获取图数据 */
  getData() {
    return this.fixData(this.graph.save());
  }

  /**
   * 改变图数据
   * @param {GraphData} data 图数据
   */
  changeData(data: GraphData) {
    this.graph.changeData(data, false);
    this.graph.updateCombos();
  }

  /**
   * 根据document事件位置计算出画布中的位置
   * @param {number} clientX 客户端x轴坐标
   * @param {number} clientY 客户端y轴坐标
   */
  calculatePosition(clientX: number, clientY: number) {
    const { x, y } = this.getClientRect();
    const { ratio } = this;
    return {
      x: (clientX - x) / ratio,
      y: (clientY - y) / ratio,
    };
  }

  /** 是否可以进行撤销 */
  canUndo() {
    return !!this.graph.getUndoStack().length;
  }

  /** 是否可以进行恢复 */
  canRedo() {
    return !!this.graph.getRedoStack().length;
  }

  /** 撤销 */
  undo() {
    undo(this.graph);
  }

  /** 恢复 */
  redo() {
    redo(this.graph);
  }

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
   * 选中元素发生改变
   */
  handleSelectedChange = () => {
    const { graph } = this;
    const nodes = graph
      .getNodes()
      .filter(
        (node: INode) => node.hasState(ItemState.Selected) && !node.hasLocked(),
      );

    if (getCombo()) {
      graph.uncombo(getCombo());
    }

    graph.createCombo(guid(), []);
    const combo: ICombo = getCombo();

    if (nodes.length > 1) {
      nodes.forEach((node: INode) => {
        graph.updateComboTree(node, combo.getID(), false);
      });
    } else {
      graph.uncombo(combo);
      removeComboControl();
    }
  };

  /**
   * 点击节点
   * @param e
   */
  handleNodeClick = ({ item }: IG6GraphEvent) => {
    const model = (item as INode).getModel() as ModelConfig;
    const { id, type, depth, ...rest } = model;
    const { onNodeClick } = this.props;

    /** 更新文本样式 */
    const update = (config: ModelConfig) => {
      item?.isItem() &&
        this.graph.updateItem(item, {
          ...config,
        });
    };

    onNodeClick?.(rest, update);
    this.props.onItemSelect?.(item?.getID() || '');
  };

  /**
   * 点击边
   * @param param0
   */
  handleEdgeClick = ({ item }: IG6GraphEvent) => {
    this.props.onItemSelect?.(item?.getID() || '');
  };

  /**
   * 点击画布
   * @param param0
   */
  handleCanvasClick = () => {
    this.props.onItemSelect?.('');
  };

  /** 查找当前选中的元素 */
  findSelected(): ISelectedItems {
    const { graph } = this;

    const edges = graph
      .findAllByState(ItemType.Edge, ItemState.Selected)
      .map((edge) => edge.getID());
    const nodes = [
      ...graph.findAllByState(ItemType.Node, ItemState.Selected),
      ...graph.findAllByState(ItemType.Combo, ItemState.Selected),
    ].map((node) => node.getID());

    /** 查找出节点关联的边 */
    nodes.forEach((id) => {
      const linkEdges = (graph.findById(id) as INode).getEdges();
      linkEdges.forEach((edge: IEdge) => {
        edges.push(edge.getID());
      });
    });

    return {
      nodes: new Set(nodes),
      edges: new Set(edges),
    };
  }

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

    allItems.forEach((id) => {
      const item = graph.findById(id);
      const stackData = getStackData(item);
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

  /** 销毁画布 */
  destroy = () => this.graph.destroy();

  /** 发布 */
  publish = (type: string, value: any) => {
    GLOBAL_EVENT[type]?.(value);
  };

  /** 订阅 */
  subscribe = (type: string, callback: (value: any) => void) => {
    GLOBAL_EVENT[type] = callback;
  };

  /** 查找所有已选择的节点 */
  private findSelectedNode = () => {
    return this.graph
      .getNodes()
      .filter((node) => node.hasState(ItemState.Selected));
  };

  /** 全选 */
  private selectAll = () => {
    this.graph.getNodes().forEach((item) => {
      this.graph.setItemState(item, ItemState.Selected, true);
    });
    this.handleSelectedChange();
  };

  /** 锁定节点 */
  lock = (node?: INode) => {
    const nodes = node ? [node] : this.findSelectedNode();
    nodes.forEach((node) => {
      node.lock();
      removeControlPoints(node);
      drawControlPoints(node);
    });
    this.handleSelectedChange();
  };

  /** 解锁节点 */
  unlock = (node?: INode) => {
    const nodes = node ? [node] : this.findSelectedNode();
    nodes.forEach((node) => {
      node.unlock();
      removeControlPoints(node);
      drawControlPoints(node);
    });
    this.handleSelectedChange();
  };
}

export default FlowEditor;
