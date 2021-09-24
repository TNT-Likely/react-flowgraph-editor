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
  icon?: typeof FontColorsOutlined;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default (props: IconConfigProps) => {
  const { defaultValue, onChange, icon: Icon, ...rest } = props;
  const [color, setColor] = useState<string>(defaultValue || '');

  const CMT = Icon || FontColorsOutlined;

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
        <CMT
          style={{
            ...IconDefaultStyle,
          }}
        />
      </Popover>
    </SingleConfig>
  );
};
