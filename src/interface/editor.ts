import { Graph } from '@antv/g6';
import { IEdge, INode } from '@antv/g6/lib/interface/item';
import {
  GraphData,
  GraphOptions,
  DefaultBehaviorType,
  NodeConfig,
  EdgeConfig,
  ComboConfig,
  ITEM_TYPE,
  TreeGraphData,
} from '@antv/g6/lib/types';

export interface IStack {
  canUndo: boolean;
  canRedo: boolean;
}

export interface IEditorProps extends Pick<GraphOptions, 'width' | 'height'> {
  data: GraphData;
  grid?: boolean;
  ratio?: number;
  editable?: boolean;
  style?: React.CSSProperties;
  behaviors?: DefaultBehaviorType[];
  onStackChange?: (stackData: IStack) => void;
  onRatioChange?: (ratio: number) => void;
}

export interface IInstance extends Pick<IEditorProps, 'ratio' | 'editable'> {
  graph: Graph;
  ratio: number;
  addNode: (
    item?: string,
    x?: number,
    y?: number,
    pushStack?: boolean,
    rest?: object,
  ) => INode;
  moveNode: (node: INode, x: number, y: number) => void;
  calculatePosition: (x: number, y: number) => { x: number; y: number };
  getData: () => GraphData | TreeGraphData;
  changeData: (data: GraphData) => void;
  changeZoom: (ratio: number, hasCallback?: boolean) => void;
  undo: () => void;
  redo: () => void;
  deleteSelected: () => void;
  copy: () => void;
  paste: () => void;
}

export interface ISelectedItems {
  nodes: Set<string>;
  edges: Set<string>;
}

export type IDirection = 'x' | 'y';

export interface INodeStack extends NodeConfig {
  itemType: ITEM_TYPE;
}

export interface IEdgeStack extends EdgeConfig {
  itemType: ITEM_TYPE;
}

export interface IComboStack extends ComboConfig {
  itemType: ITEM_TYPE;
}

export type IItemStack = INodeStack | IEdgeStack | IComboStack;

export interface IStackData {
  [index: string]: IItemStack[];
  nodes: Array<INodeStack>;
  edges: Array<IEdgeStack>;
  combos: Array<IComboStack>;
}

export interface IStackDatas {
  before: IStackData;
  after: IStackData;
}
