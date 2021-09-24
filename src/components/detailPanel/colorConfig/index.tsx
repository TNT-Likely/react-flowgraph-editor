import React, { useEffect, useState } from 'react';
import { Icon, Popover } from 'antd';
import { SketchPicker } from 'react-color';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';
import { IconDefaultStyle } from '@/components/detailPanel/iconConfig';

export interface IconConfigProps
  extends Pick<SingleConfigProps, 'label' | 'span'> {
  type?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default (props: IconConfigProps) => {
  const { type = 'font-colors', defaultValue, onChange, ...rest } = props;
  const [color, setColor] = useState<string>(defaultValue || '');

  return (
    <SingleConfig {...rest}>
      <Popover
        content={
          <SketchPicker
            color={color}
            onChangeComplete={(e: any) => {
              setColor(e.hex);
              onChange?.(e.hex);
            }}
          />
        }
      >
        <Icon
          type={type}
          style={{
            ...IconDefaultStyle,
          }}
        />
      </Popover>
    </SingleConfig>
  );
};
