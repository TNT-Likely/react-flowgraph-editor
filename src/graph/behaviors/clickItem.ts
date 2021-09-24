import G6 from '@antv/g6';

import { clearSelected, showLabelEditor } from '@/util';
import { ItemState, ItemType, BehaviorType } from '@/constant';
import { Instance } from '@/index';

import { Graph } from '@antv/g6';
import { IG6GraphEvent, BehaviorOption } from '@antv/g6/lib/types';

const clickItemBehavior: BehaviorOption = {
  getDefaultCfg(): object {
    return {
      item: null,
      multiple: true,
      keydown: false,
      keyCode: 17,
    };
  },

  getEvents() {
    return {
      'edge:click': 'handleItemClick',
      'node:dblclick': 'handleItemDbClick',
      'edge:dblclick': 'handleItemDbClick',
      'canvas:click': 'handleCanvasClick',
      keydown: 'handleKeyDown',
      keyup: 'handleKeyUp',
    };
  },

  handleItemClick({ item }: IG6GraphEvent) {
    if (!item) return;
    this.item = item;
    const graph = this.graph as Graph;

    const isSelected = item?.hasState(ItemState.Selected);

    if (this.multiple && this.keydown) {
      graph.setItemState(item, ItemState.Selected, !isSelected);
    } else {
      clearSelected(graph, (selectedItem) => {
        return selectedItem !== item;
      });

      if (!isSelected) {
        graph.setItemState(item, ItemState.Selected, true);
      }
    }
  },

  /** 双击节点或者边 */
  handleItemDbClick({ item }: IG6GraphEvent) {
    if (!item) return;
    const isNode = item.getType() === ItemType.Node;
    if (isNode && item.hasLocked()) return;

    const graph = this.graph as Graph;

    const { ratio } = Instance;
    const group = item.getContainer();

    /** 当前选中节点/边的文本 */
    const { label } = item.getModel();

    let style;
    let shape;

    /** 计算文本编辑框样式 */
    if (isNode) {
      const { width, height, x, y } = item.getBBox();
      const padding = 20;

      style = {
        width: (width - padding) * ratio,
        minHeight: (height + padding) * ratio,
        left: (x + padding * 0.5) * ratio,
        top: (y - padding * 0.5) * ratio,
      };
    } else {
      const { x, y } = (item.getKeyShape() as any).getPoint(0.5);
      shape = group.findAllByName('text-bg-shape')[0];
      const width = 20;
      const height = 10;
      const padding = 20;

      const actualWidth = (shape && shape.getBBox().width) || width + padding;
      const actualHeight = height + padding;

      style = {
        minWidth: width + padding,
        height: height + padding,
        left: x * ratio - actualWidth / 2,
        top: y * ratio - actualHeight / 2,
      };
    }

    const text = typeof label === 'string' ? label : label?.text;

    showLabelEditor(text, style, (value: string) => {
      /** 更新前后标签不一致时才推入堆栈 */
      graph.updateItem(item, { label: value }, label !== value);
    });
  },

  handleCanvasClick(e: IG6GraphEvent) {
    const graph = this.graph as Graph;
    this.item = null;

    clearSelected(graph);
  },

  handleKeyDown(e: any) {
    this.keydown = (e.keyCode || e.which) === this.keyCode;
  },

  handleKeyUp() {
    this.keydown = false;
  },
};

G6.registerBehavior(BehaviorType.ClickItem, clickItemBehavior);
