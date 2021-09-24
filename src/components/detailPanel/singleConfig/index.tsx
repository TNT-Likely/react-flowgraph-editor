import React from 'react';

import { prefixCls } from '@/components/detailPanel';

export interface SingleConfigProps {
  label?: string;
  children?: React.ReactNode;
  span?: number;
}

/**
 * 单个配置项
 * @param props
 */
export default (props: SingleConfigProps) => {
  const { children, label, span = 1 } = props;
  return (
    <div className={`${prefixCls}-single`} style={{ width: `${span * 25}%` }}>
      {children}
      <span className={`${prefixCls}-single-label`}>{label}</span>
    </div>
  );
};
