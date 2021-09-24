import React from 'react';
import { Radio } from 'antd';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';
import { BoldOutlined } from '@ant-design/icons';

import './index.less';

interface IList {
  icon: typeof BoldOutlined;
  value: string;
}

export interface IconListConfigProps
  extends Pick<SingleConfigProps, 'label' | 'span'> {
  list: IList[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const prefixCls = 'icon-list-config';

export default (props: IconListConfigProps) => {
  const { list = [], defaultValue, onChange, ...rest } = props;
  return (
    <SingleConfig {...rest}>
      <Radio.Group
        className={prefixCls}
        defaultValue={defaultValue}
        onChange={(e: any) => onChange?.(e.target.value)}
        size="small"
      >
        {list.map(({ icon: Icon, value }) => (
          <Radio.Button value={value} key={value}>
            <Icon />
          </Radio.Button>
        ))}
      </Radio.Group>
    </SingleConfig>
  );
};
