import G6 from '@antv/g6';

import { Instance } from '@/index';
import { BehaviorType, KeyCode } from '@/constant';

import { zoomIn, zoomOut, zoomZero } from '@/util';

const behavior = {
  isControl: false,
  isShift: false,
  getEvents() {
    return {
      keydown: 'handleKeyDown',
      keyup: 'handleKeyUp',
    };
  },

  handleKeyDown(e: KeyboardEvent) {
    switch (e.keyCode) {
      case KeyCode.Z:
        if (e.ctrlKey || e.metaKey) {
          Instance.undo();
        }
        break;
      case KeyCode.Y:
        if (e.ctrlKey || e.metaKey) {
          Instance.redo();
        }
        break;
      case KeyCode.Backspace:
        Instance.deleteSelected();
        break;
      case KeyCode.C:
        if (e.ctrlKey || e.metaKey) {
          Instance.copy();
        }
        break;
      case KeyCode.V:
        if (e.ctrlKey || e.metaKey) {
          Instance.paste();
        }
        break;
      case KeyCode.Add:
      case KeyCode.NumberAdd:
        if (e.ctrlKey || e.metaKey) {
          zoomIn();
        }
        break;
      case KeyCode.Minus:
      case KeyCode.NumberMinus:
        if (e.ctrlKey || e.metaKey) {
          zoomOut();
        }
        break;
      case KeyCode.Zero:
      case KeyCode.NumberZero:
        if (e.ctrlKey || e.metaKey) {
          zoomZero();
        }
        break;
      case KeyCode.A:
        if (e.ctrlKey || e.metaKey) {
          Instance.selectAll();
        }
        break;
      case KeyCode.L:
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          Instance.unlock();
          break;
        }

        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          Instance.lock();
          break;
        }
    }
  },

  handleKeyUp(e: KeyboardEvent) {},
};

G6.registerBehavior(BehaviorType.ShortCuts, behavior);
