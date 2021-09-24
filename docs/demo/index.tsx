import React, { useState } from 'react';
import Editor, { DragItem, DetailPanel } from 'r-flowgraph-editor';
import Style from './index.module.less';

const Main = (props) => {
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

  const [itemId, setItemId] = useState<string>('');

  return (
    <div className={Style.main}>
      <div className={Style.header}></div>
      <div className={Style.body}>
        <div className={Style.materials}>
          <DragItem>矩形</DragItem>
        </div>
        <div className={Style.workzone}>
          <Editor data={data} grid onItemSelect={(id) => setItemId(id)} />
        </div>
        <div className={Style.panel}>
          <DetailPanel id={itemId} />
        </div>
      </div>
    </div>
  );
};

export default Main;
