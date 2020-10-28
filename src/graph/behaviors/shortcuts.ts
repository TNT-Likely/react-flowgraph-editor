import G6 from '@antv/g6';

import { Instance } from '@/index';
import { BehaviorType, KeyCode } from '@/constant';

import { zoomIn, zoomOut, zoomZero } from '@/util';

const behavior = {
  isControl: false,
  getEvents() {
    return {
      keydown: 'handleKeyDown',
      keyup: 'handleKeyUp',
    };
  },

  handleKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    console.log(e.keyCode);
    switch (e.keyCode) {
      case KeyCode.Control:
        this.isControl = true;
        break;
      case KeyCode.Z:
        if (this.isControl) {
          Instance.undo();
        }
        break;
      case KeyCode.Y:
        if (this.isControl) {
          Instance.redo();
        }
        break;
      case KeyCode.Backspace:
        Instance.deleteSelected();
        break;
      case KeyCode.C:
        if (this.isControl) {
          Instance.copy();
        }
        break;
      case KeyCode.V:
        if (this.isControl) {
          Instance.paste();
        }
        break;
      case KeyCode.Add:
      case KeyCode.NumberAdd:
        if (this.isControl) {
          zoomIn();
        }
        break;
      case KeyCode.Minus:
      case KeyCode.NumberMinus:
        if (this.isControl) {
          zoomOut();
        }
        break;
      case KeyCode.Zero:
      case KeyCode.NumberZero:
        if (this.isControl) {
          zoomZero();
        }
    }
  },

  handleKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    switch (e.keyCode) {
      case KeyCode.Control:
        this.isControl = false;
        break;
    }
  },
};

G6.registerBehavior(BehaviorType.ShortCuts, behavior);
