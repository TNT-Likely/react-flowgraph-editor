import createDOM from '@antv/dom-util/lib/create-dom';
import modifyCSS from '@antv/dom-util/lib/modify-css';

import { Instance } from '@/index';
import { PrefixCls } from '@/constant';

import { TLabelOnChange } from '@/interface';

const labelEditorCls = `${PrefixCls}-editable-label`;

let globalOnChange: TLabelOnChange;
const handleChange = (e?: MouseEvent) => {
  e?.stopPropagation();
  const value = getLabelEditor().innerText;
  if (globalOnChange) {
    globalOnChange(value);
  }

  hideLabelEditor();
};

const handleKeyDown = (e: KeyboardEvent) => {
  e.stopPropagation();
  if (e.keyCode === 13) {
    handleChange();
  }
};

const getLabelEditor = () => {
  const { graph } = Instance;
  const labelEditor = document.querySelector(`.${labelEditorCls}`);

  if (!labelEditor) {
    const container = graph.getContainer();
    const dom = createDOM(
      `<div class='${labelEditorCls}' contentEditable></div>`,
    );
    container.appendChild(dom);
    return dom;
  }

  return labelEditor;
};

export const showLabelEditor = (
  text: string = '',
  style: any,
  onChange: TLabelOnChange,
) => {
  const { ratio } = Instance;
  const { x: cX, y: cY } = Instance.graph
    .getContainer()
    .getBoundingClientRect();

  style.width = style.width + 'px';
  style.height = style.height + 'px';
  style.minWidth = style.minWidth + 'px';
  style.minHeight = style.minHeight + 'px';
  style.left = style.left + cX + 'px';
  style.top = style.top + cY + 'px';

  const labelEditor = getLabelEditor();

  window.requestAnimationFrame(() => {
    globalOnChange = onChange;
    labelEditor.innerHTML = text;
    document.addEventListener('click', handleChange);
    labelEditor.addEventListener('click', (e: MouseEvent) =>
      e.stopPropagation(),
    );
    labelEditor.addEventListener('blur', handleChange);
    labelEditor.addEventListener('keydown', handleKeyDown);
    if (window.getSelection) {
      const range = window.getSelection();

      /** 选中内容 */
      range?.selectAllChildren(labelEditor);

      /** 光标移动到最后(与选中内容相互冲突) */
      // range.collapseToEnd()
    }
    modifyCSS(labelEditor, { ...style, visibility: 'visible' });

    labelEditor.focus();
  });
};

export const hideLabelEditor = () => {
  const labelEditor = getLabelEditor();
  document.removeEventListener('click', handleChange);
  labelEditor.removeEventListener('blur', handleChange);
  labelEditor.removeEventListener('keydown', handleKeyDown);
  modifyCSS(labelEditor, { visibility: 'hidden' });
};
