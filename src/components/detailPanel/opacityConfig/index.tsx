import React from 'react';
import { InputNumber } from 'antd';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';

export interface OpacityConfigProps
  extends Pick<SingleConfigProps, 'label' | 'span'> {
  defaultValue: number;
  onChange?: (value: number) => void;
}

export default (props: OpacityConfigProps) => {
  const { defaultValue, onChange, label = '透明度', ...rest } = props;

  return (
    <SingleConfig label={label} {...rest}>
      <InputNumber
        defaultValue={defaultValue * 100}
        onChange={(value: number) => {
          onChange?.(value / 100);
        }}
        min={0}
        max={100}
        step={5}
      />
    </SingleConfig>
  );
};
