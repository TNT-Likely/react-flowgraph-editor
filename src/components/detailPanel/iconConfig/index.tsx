import React, { useState } from 'react';
import { Icon } from 'antd';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';
import { SelectConfigProps } from '../selectConfig';

export interface IconConfigProps
  extends Pick<SelectConfigProps, 'label' | 'span'> {
  type?: string;
  defaultValue?: string;
  values: [string, string];
  onChange?: (value: string) => void;
}

export const IconDefaultStyle = {
  width: '32px',
  height: '32px',
  fontSize: '14px',
  padding: '9px',
  borderRadius: '8px',
  margin: '0 auto',
};

export default (props: IconConfigProps) => {
  const { type, defaultValue, values, onChange, ...rest } = props;
  const [value, setValue] = useState<string>(defaultValue || '');
  const active = value === values[1];

  const toggle = () => {
    const toggleValue = value === values[0] ? values[1] : values[0];
    setValue(toggleValue);
    onChange?.(toggleValue);
  };

  return (
    <SingleConfig {...rest}>
      <Icon
        type={type}
        onClick={toggle}
        style={{
          ...IconDefaultStyle,
          backgroundColor: active ? '#eee' : 'transparent',
        }}
      />
    </SingleConfig>
  );
};
