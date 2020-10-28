import { Graph } from '@antv/g6';

import { IItemStack } from '@/interface';

/**
 * 撤销操作
 * @param {Graph} graph 图实例
 */
export const undo = (graph: Graph) => {
  const undoStack = graph.getUndoStack();

  if (!undoStack || undoStack.length <= 1) {
    return;
  }

  const currentData = undoStack.pop();

  if (currentData) {
    const { action } = currentData;
    graph.pushStack(action, Object.assign({}, currentData.data), 'redo');
    let data = currentData.data.before;

    if (action === 'add') {
      data = currentData.data.after;
    }

    if (!data) return;

    switch (action) {
      case 'update':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: IItemStack) => {
            graph.updateItem(model.id || '', model, false);
          });
        });
        break;

      case 'delete':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: IItemStack) => {
            const itemType = model.itemType;
            graph.addItem(itemType, model, false);
          });
        });
        break;

      case 'add':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: IItemStack) => {
            graph.removeItem(model.id || '', false);
          });
        });
        break;
    }
  }
};

/**
 * 恢复操作
 * @param {Graph} graph 图实例
 */
export const redo = (graph: Graph) => {
  const redoStack = graph.getRedoStack();

  if (!redoStack || redoStack.length === 0) {
    return;
  }

  const currentData = redoStack.pop();

  if (currentData) {
    const { action } = currentData;
    let data = currentData.data.after;
    graph.pushStack(action, Object.assign({}, currentData.data));
    if (action === 'delete') {
      data = currentData.data.before;
    }

    if (!data) return;

    switch (action) {
      case 'update':
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: IItemStack) => {
            graph.updateItem(model.id || '', model, false);
          });
        });
        break;
      case 'delete':
        if (data.edges) {
          data.edges.forEach((model: IItemStack) => {
            graph.removeItem(model.id || '', false);
          });
        }
        if (data.nodes) {
          data.nodes.forEach((model: IItemStack) => {
            graph.removeItem(model.id || '', false);
          });
        }
        if (data.combos) {
          data.combos.forEach((model: IItemStack) => {
            graph.removeItem(model.id || '', false);
          });
        }
        break;
      case 'add': {
        Object.keys(data).forEach(key => {
          const array = data[key];
          if (!array) return;
          array.forEach((model: IItemStack) => {
            const itemType = model.itemType;
            graph.addItem(itemType, model, false);
          });
        });
        break;
      }
      default:
    }
  }
};
