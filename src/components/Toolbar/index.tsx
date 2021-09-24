import React from 'react';
import Style from './index.module.less';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from '@ant-design/icons';
import { Instance } from '@/index';
import IconAction from '../IconAction';
import { zoomIn, zoomOut, undo, redo } from '@/util';

export interface IToolbarProps {
  disabled?: {
    zoomOut?: boolean;
    zoomIn?: boolean;
    undo?: boolean;
    redo?: boolean;
  };
}

const Main: React.FC<IToolbarProps> = (props) => {
  const { disabled } = props;

  return (
    <div className={Style.main}>
      <IconAction
        text="缩小"
        icon={ZoomOutOutlined}
        shortcut="-"
        onClick={zoomOut}
        disabled={disabled?.zoomOut}
      />
      <IconAction
        text="放大"
        icon={ZoomInOutlined}
        shortcut="+"
        onClick={zoomIn}
        disabled={disabled?.zoomIn}
      />
      <IconAction
        text="回退"
        icon={SwapLeftOutlined}
        shortcut="z"
        onClick={() => undo(Instance.graph)}
        disabled={disabled?.undo}
      />
      <IconAction
        text="前进"
        icon={SwapRightOutlined}
        shortcut="y"
        onClick={() => redo(Instance.graph)}
        disabled={disabled?.redo}
      />
    </div>
  );
};

export default Main;
