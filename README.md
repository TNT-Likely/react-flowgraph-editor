# react-flowgraph-editor

基于 react 与 g6 的流程图编辑器

## 开始使用

安装依赖

```bash
$ npm i -s react-flowgraph-editor
```

```tsx
import React, { useState } from 'react';
import Editor, { DragItem } from 'react-flowgraph-editor';
import './index.less';

const data = {
  nodes: [
    {
      id: '111',
      label: 'hello',
      x: 100,
      y: 100,
    },

    {
      id: '222',
      label: 'hello',
      x: 300,
      y: 300,
    },
  ],
  edges: [
    {
      source: '111',
      sourceAnchor: 0,
      target: '222',
      targetAnchor: 0,
    },
  ],
};

export default () => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const onStackChange = e => {
    setCanUndo(e.canUndo);
    setCanRedo(e.canRedo);
  };

  return (
    <div>
      <div className="toolbar">
        <button disabled={!canUndo}>撤销</button>
        <button disabled={!canRedo}>恢复</button>
      </div>
      <div className="container">
        <div className="dragitems">
          <DragItem>矩形</DragItem>
          <DragItem type="flowRoundRect">圆角矩形</DragItem>
          <DragItem type="flowCircle">圆形</DragItem>
          <DragItem type="flowDiamond">菱形</DragItem>
        </div>
        <Editor data={data} grid onStackChange={onStackChange} />
      </div>
    </div>
  );
};
```
