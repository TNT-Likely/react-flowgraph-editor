import React from 'react';
import { Radio, Icon } from 'antd';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';

import './index.less';

interface IList {
  type: string;
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
        {list.map(({ type, value }) => (
          <Radio.Button value={value} key={value}>
            <Icon type={type} />
          </Radio.Button>
        ))}
      </Radio.Group>
    </SingleConfig>
  );
};
