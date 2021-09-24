/**
 * iframe: 720
 */
import React, { useState } from 'react';
import Editor, { DragItem, DetailPanel, ToolBar } from 'r-flowgraph-editor';
import Style from './index.module.less';
import { createFromIconfontCN } from '@ant-design/icons';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2832936_1y0tjuleyst.js', // 在 iconfont.cn 上生成
  extraCommonProps: {
    style: { fontSize: 20 },
  },
});

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
      <div className={Style.header}>
        <ToolBar />
      </div>
      <div className={Style.body}>
        <div className={Style.materials}>
          <DragItem type="flowText">
            <MyIcon type="icon-text" />
          </DragItem>
          <DragItem>
            <MyIcon type="icon-rect" />
          </DragItem>
          <DragItem type="flowRoundRect">
            <MyIcon type="icon-roundRect" />
          </DragItem>
          <DragItem type="flowCircle">
            <MyIcon type="icon-circle" />
          </DragItem>
          <DragItem type="flowDiamond">
            <MyIcon type="icon-diamond" />
          </DragItem>
        </div>
        <div className={Style.workzone}>
          <Editor data={data} onItemSelect={(id) => setItemId(id)} />
        </div>
        <div className={Style.panel}>
          <DetailPanel id={itemId} />
        </div>
      </div>
    </div>
  );
};

export default Main;
