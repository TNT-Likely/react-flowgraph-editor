import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { FontColorsOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import SingleConfig, {
  SingleConfigProps,
} from '@/components/detailPanel/singleConfig';
import { IconDefaultStyle } from '@/components/detailPanel/iconConfig';

export interface IconConfigProps
  extends Pick<SingleConfigProps, 'label' | 'span'> {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default (props: IconConfigProps) => {
  const { defaultValue, onChange, ...rest } = props;
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
        <FontColorsOutlined
          style={{
            ...IconDefaultStyle,
          }}
        />
      </Popover>
    </SingleConfig>
  );
};
