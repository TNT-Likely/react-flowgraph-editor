import React from 'react';
import { Tooltip } from 'antd';
import { BoldOutlined } from '@ant-design/icons';
import Style from './index.module.less';

export interface IIconActionProps {
  icon: typeof BoldOutlined;

  text?: string;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Main: React.FC<IIconActionProps> = (props) => {
  const { icon: Icon, disabled, text, shortcut, onClick } = props;

  const color = disabled ? '#ccc' : '#222';

  const handleClick = () => {
    onClick?.();
  };

  const content = (
    <div onClick={handleClick} className={Style.main}>
      <Icon style={{ color }} />
      {!!text && (
        <span className={Style.text} style={{ color }}>
          {text}
        </span>
      )}
    </div>
  );

  return shortcut ? (
    <Tooltip title={`Ctrl + ${shortcut}`}>{content}</Tooltip>
  ) : (
    content
  );
};

export default Main;
