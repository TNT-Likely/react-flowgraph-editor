import createDOM from '@antv/dom-util/lib/create-dom';
import modifyCSS from '@antv/dom-util/lib/modify-css';

import { Instance } from '@/index';
import { PrefixCls } from '@/constant';

import { INode } from '@antv/g6/lib/interface/item';

const tooltipCls = `${PrefixCls}-tooltip`;

const getTooltip = () => {
  const { graph } = Instance;
  const tooltip = document.querySelector(`.${tooltipCls}`);

  if (!tooltip) {
    const container = graph.getContainer();
    const dom = createDOM(`<div class='${tooltipCls}'></div>`);
    container.appendChild(dom);
    return dom;
  }

  return tooltip;
};

export const showTooltip = (text: string, node: INode) => {
  const { ratio } = Instance;
  const { x, y, width, height } = node.getBBox();
  const {
    x: cX,
    y: cY,
  } = Instance.graph.getContainer().getBoundingClientRect();

  const style = {
    left: (x + width / 2) * ratio - 60 + cX + 'px',
    top: (y + height + 10) * ratio + cY + 'px',
    visibility: 'visible',
  };

  const tooltip = getTooltip();

  window.requestAnimationFrame(() => {
    tooltip.innerHTML = text;
    modifyCSS(tooltip, style);
  });
};

export const hideTooltip = () => {
  const tooltip = getTooltip();
  modifyCSS(tooltip, { visibility: 'hidden' });
};
