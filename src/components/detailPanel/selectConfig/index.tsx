import React, { ReactNode } from 'react';
import { Select } from 'antd';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';

interface IList {
  label: string | ReactNode;
  value: string;
}

export interface SelectConfigProps
  extends Pick<SingleConfigProps, 'label' | 'span'> {
  list: IList[] | string[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

/**
 * 下拉类型配置项
 * @param props
 */
export default (props: SelectConfigProps) => {
  const { list = [], defaultValue, onChange, ...rest } = props;
  return (
    <SingleConfig {...rest}>
      <Select
        defaultValue={defaultValue}
        onChange={(value: string) => onChange?.(value)}
      >
        {list.map((s: any) => (
          <Select.Option value={s.value || s}>{s.label || s}</Select.Option>
        ))}
      </Select>
    </SingleConfig>
  );
};
