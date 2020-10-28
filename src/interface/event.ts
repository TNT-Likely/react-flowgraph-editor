import { IEdge, INode } from '@antv/g6/lib/interface/item';
import { IG6GraphEvent, IPoint, Item } from '@antv/g6/lib/types';

export interface IEdgeEvent extends IG6GraphEvent {
  item: IEdge;
}

export interface INodeEvent extends IG6GraphEvent {
  item: INode;
}
