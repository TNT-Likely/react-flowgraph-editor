import G6 from '@antv/g6';
import {
  ItemState,
  EdgeType,
  DRAGLINE_NAME,
  DRAGLINE_INDEX,
  EDGE_LABEL_CLASS_NAME,
  EDGE_LABEL_WRAPPER_CLASS_NAME,
  EDGE_START_PLACEHOLDER_NAME,
  EDGE_END_PLACEHOLDER_NAME,
} from '@/constant';
import { getPolylinePoints } from '@/util';

import GGroup from '@antv/g-canvas/lib/group';
import { IEdge, INode } from '@antv/g6/lib/interface/item';
import { IPoint, EdgeConfig } from '@antv/g6/lib/types';
import { RouterCfg } from '@antv/g6/lib/shape/edges/router';

import { IEdgePlaceholderPoint } from '@/interface';

const PLACEHOLDER_SIZE = 24;
const PLACEHOLDER_STYLE = {
  width: PLACEHOLDER_SIZE,
  height: PLACEHOLDER_SIZE,
  lineWidth: 1,
  stroke: '#5AAAFF',
  fill: '#fff',
  cursor: 'move',
  opacity: 0,
};
const PLACEHOLD_ZINDEX = 2;
const CLS_SHAPE = 'edge-shape';

const DRAGLINE_STYLE = {
  lineWidth: 2,
  stroke: '#fa3246',
  lineAppendWidth: 5,
  opacity: 0,
};

const bizFlowEdge: any = {
  options: {
    style: {
      stroke: '#ccc1d8',
      lineAppendWidth: 5,
      lineWidth: 2,
      shadowColor: null,
      shadowBlur: 4,
      radius: 8,
      offset: 24,
      endArrow: {
        path: 'M 0,0 L 4,3 L 4,-3 Z',
      },
      cursor: 'pointer',
    },
    labelCfg: {
      style: {
        fill: '#000000',
        fontSize: 14,
        lineHeight: 14,
        cursor: 'pointer',
        background: {
          padding: [0, 0, 0, 0],
          // padding: [5, 5, 5, 5],
          fill: '#fff',
          // stroke: '#fa3246'
        },
      },
    },
    routeCfg: {},
    stateStyles: {
      [ItemState.Selected]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        shadowBlur: 24,
      },
      [ItemState.HighLight]: {
        stroke: '#5aaaff',
        shadowColor: '#5aaaff',
        shadowBlur: 24,
      },
    },
  },

  getPath(
    points: IPoint[],
    source: INode,
    target: INode,
    radius: number,
    cfg?: any,
  ) {
    if (this.cfg.nowPath) {
      return this.cfg.nowPath;
    }

    const offset = 30;

    const linePoints = getPolylinePoints(
      points[0],
      points[1],
      source,
      target,
      offset,
    );

    const pathArray: [string, number, number][] = [];

    linePoints.forEach((point: any, index: number) => {
      if (index === 0) {
        pathArray.push(['M', point.x, point.y]);
      } else {
        pathArray.push(['L', point.x, point.y]);
      }
    });

    return pathArray;
  },

  drawShape(cfg: EdgeConfig, group: GGroup) {
    this.cfg = cfg;
    const shapeStyle = this.getShapeStyle(cfg);

    if (cfg.path) {
      shapeStyle.path = cfg.path;
    }

    const shape = group.addShape('path', {
      className: CLS_SHAPE,
      name: CLS_SHAPE,
      attrs: shapeStyle,
    });

    return shape;
  },

  update(cfg: EdgeConfig, item: IEdge) {
    this.cfg = cfg;

    /** 清除path的缓存，避免label位置不更新的问题 */
    const shape: any = item.getKeyShape();
    shape._calculateCurve();
    shape._setTcache();

    this.updateShapeStyle(cfg, item);
    this.updateLabel(cfg, item);
  },

  afterDraw(model: EdgeConfig, group: GGroup) {
    this.drawPlaceholder(model, group);
    this.drawDragLine(model, group);
  },

  afterUpdate(model: EdgeConfig, item: IEdge) {
    const group = item.getContainer();

    this.drawPlaceholder(model, group);
    this.drawDragLine(model, group);
  },

  /**
   * 绘制边可拖拽的线
   * @param {array} path 边的路径
   */
  drawDragLine(model: EdgeConfig, group: GGroup) {
    const shape = group.find(
      element => element.get('className') === 'edge-shape',
    );

    const linePoints = shape.attr('path').map((point: any) => ({
      x: point[1],
      y: point[2],
    }));

    const linePath: IEdgePlaceholderPoint[] = [];

    for (let i = 1; i < linePoints.length - 1; i++) {
      const pre = linePoints[i - 1];
      const cur = linePoints[i];
      const next = linePoints[i + 1];
      if (
        (cur.x === pre.x && cur.x === next.x) ||
        (cur.y === pre.y && cur.y === next.y)
      ) {
        continue;
      } else {
        linePath.push({ ...cur, index: i });
      }
    }

    this.removeUnnecessaryLine(linePath, group);

    for (let i = 1; i < linePath.length; i++) {
      this.drawSingleLine(linePath[i - 1], linePath[i], model.id, group);
    }
  },

  /** 移除多余的拖拽线 */
  removeUnnecessaryLine(linePath: IEdgePlaceholderPoint[], group: GGroup) {
    const shapes = group.findAllByName(DRAGLINE_NAME);
    const length = linePath.length;
    shapes.forEach((shape, index) => {
      if (index > length - 2) {
        group.removeChild(shape);
      }
    });
  },

  removeDragLine(group: GGroup) {
    const shapes = group.findAllByName(DRAGLINE_NAME);
    shapes.forEach(shape => group.removeChild(shape));
  },

  drawSingleLine(
    sPoint: IEdgePlaceholderPoint,
    ePoint: IEdgePlaceholderPoint,
    edgeId: string,
    group: GGroup,
  ) {
    const index = sPoint.index;
    const id = `drag_line_${edgeId}_${index}_${index + 1}`;
    const shape = group.findById(id);

    const getPath = () => {
      return [
        ['M', sPoint.x, sPoint.y],
        ['L', ePoint.x, ePoint.y],
      ];
    };

    const getStyle = () => {
      return {
        ...DRAGLINE_STYLE,
        cursor: sPoint.x === ePoint.x ? 'ew-resize' : 'ns-resize',
      };
    };

    if (!shape) {
      group
        .addShape('path', {
          name: DRAGLINE_NAME,
          id,
          attrs: {
            path: getPath(),
            ...getStyle(),
          },
        })
        .set(DRAGLINE_INDEX, index);
    } else {
      shape.attr({
        path: getPath(),
        ...getStyle(),
      });
    }
  },

  /** 绘制拖动边占位符 */
  drawPlaceholder(model: EdgeConfig, group: GGroup) {
    const startPlaceholder = group.findAllByName(
      EDGE_START_PLACEHOLDER_NAME,
    )[0];
    const endPlaceholder = group.findAllByName(EDGE_END_PLACEHOLDER_NAME)[0];

    if (!startPlaceholder) {
      const shape = group.addShape('rect', {
        name: EDGE_START_PLACEHOLDER_NAME,
        attrs: {
          ...PLACEHOLDER_STYLE,
        },
      });
      shape.set('zIndex', PLACEHOLD_ZINDEX);
    }

    if (!endPlaceholder) {
      const shape = group.addShape('rect', {
        name: EDGE_END_PLACEHOLDER_NAME,
        attrs: {
          ...PLACEHOLDER_STYLE,
        },
      });
      shape.set('zIndex', PLACEHOLD_ZINDEX);
    }

    group.sort();

    this.updatePlaceholder(model, group);
  },

  updatePlaceholder(model: EdgeConfig, group: GGroup) {
    const { startPoint, endPoint } = model;
    const startPlaceholder = group.findAllByName(
      EDGE_START_PLACEHOLDER_NAME,
    )[0];
    const endPlaceholder = group.findAllByName(EDGE_END_PLACEHOLDER_NAME)[0];

    if (startPlaceholder) {
      startPlaceholder.attr({
        x: (startPoint?.x || 0) - PLACEHOLDER_SIZE * 0.5,
        y: (startPoint?.y || 0) - PLACEHOLDER_SIZE * 0.5,
      });
    }

    if (endPlaceholder) {
      endPlaceholder.attr({
        x: (endPoint?.x || 0) - PLACEHOLDER_SIZE * 0.5,
        y: (endPoint?.y || 0) - PLACEHOLDER_SIZE * 0.5,
      });
    }
  },

  setState(name: string, value: boolean, item: IEdge) {
    const shape = item.get('keyShape');

    if (!shape) {
      return;
    }

    const { style, stateStyles } = this.options;

    const stateStyle = stateStyles[name];

    if (!stateStyle) {
      return;
    }

    if (value) {
      shape.attr({
        ...style,
        ...stateStyle,
      });
    } else {
      shape.attr(style);
    }
  },
};

G6.registerEdge(EdgeType.FlowEdge, bizFlowEdge, EdgeType.Polyline);
