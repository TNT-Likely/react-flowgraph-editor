import React, { Children, ReactNode, useEffect, useState } from 'react';
import { Input, InputNumber, Select } from 'antd';
import {
  LineOutlined,
  DashOutlined,
  SmallDashOutlined,
  BoldOutlined,
  ItalicOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import {
  ItemType,
  LABEL_CLASS_NAME,
  EDGE_LABEL_CLASS_NAME,
  ALLOW_FONT_FAMILY,
} from '@/constant';
import SingleConfig from '@/components/detailPanel/singleConfig';
import SelectConfig from '@/components/detailPanel/selectConfig';
import IconConfig from '@/components/detailPanel/iconConfig';
import ColorConfig from '@/components/detailPanel/colorConfig';
import OpacityConfig from '@/components/detailPanel/opacityConfig';
import IconListConfig from '@/components/detailPanel/iconListConfig';
import { DetailPanelProps } from '@/interface';
import { Instance } from '@/index';

interface IStyle {
  [index: string]: number | string;
}

import './index.less';

export const prefixCls = 'editor-detail-panel';

export const DetailPanel: React.FC<DetailPanelProps> = (props) => {
  const { id = '' } = props;
  const item = Instance.graph?.findById(id);
  if (!Instance.graph || !item || !id) return null;
  const isEdge = item.getType() === ItemType.Edge;
  const { graph } = Instance;
  const model = item.getModel();
  const { x, y, type } = model;
  const [width, height] = (model.size || [0, 0]) as number[];
  const group = item.getContainer();
  const wrapper = item.getKeyShape();
  const wrapperStyle = model.style;
  let label,
    labelStyle = {};
  try {
    label = group.findByClassName(
      isEdge ? EDGE_LABEL_CLASS_NAME : LABEL_CLASS_NAME,
    );
    labelStyle = (model.labelCfg as any)?.style;
  } catch {}

  const {
    fill,
    fontSize,
    fontStyle,
    fontWeight,
    lineHeight,
    fillOpacity,
    fontFamily,
    textAlign,
    textBaseline,
  } = label?.attr() || {};

  const {
    fill: wFill,
    stroke,
    fillOpacity: wFillOpacity,
    strokeOpacity,
    lineWidth,
    opacity,
    lineDash = [lineWidth, 0],
  } = wrapper.attr();

  /**
   * 图形配置改变
   * @param key
   * @param value
   */
  const handleWrappperChange = (key: string, value: string | number) => {
    const style: IStyle = {};
    style[key] = value;

    if (key === 'lineWidth') {
      style.lineDash = [value, (lineDash[1] * value) / lineDash[0]];
    }

    graph.updateItem(item, {
      style: {
        ...wrapperStyle,
        ...style,
      },
    });
  };

  /**
   * 文本配置改变
   * @param key
   * @param value
   */
  const handleLabelChange = (key: string, value: string | number) => {
    const style: IStyle = {};
    style[key] = value;
    graph.updateItem(item, {
      labelCfg: {
        style: {
          ...labelStyle,
          ...style,
        },
      },
    });
  };

  return (
    <div className={prefixCls} key={id}>
      <div className={`${prefixCls}-header`}>元素信息</div>
      <p className={`${prefixCls}-info`}>ID：{model.id}</p>
      <p className={`${prefixCls}-info`}>类型：{type}</p>
      {!isEdge && (
        <>
          <p className={`${prefixCls}-info`}>
            尺寸：长{width.toFixed(0)}, 宽{height.toFixed(0)}
          </p>
          <p className={`${prefixCls}-info`}>
            坐标：横坐标{x?.toFixed(0)}, 纵坐标{y?.toFixed(0)}
          </p>
        </>
      )}
      <div className={`${prefixCls}-hr`}></div>
      <div className={`${prefixCls}-header`}>元素配置</div>
      <div className={`${prefixCls}-content`}>
        <OpacityConfig
          defaultValue={opacity}
          onChange={(value: number) => handleWrappperChange('opacity', value)}
        />
      </div>
      {!isEdge && (
        <>
          <div className={`${prefixCls}-header`}>背景配置</div>
          <div className={`${prefixCls}-content`}>
            <ColorConfig
              icon={BgColorsOutlined}
              defaultValue={wFill}
              onChange={(value: string) => handleWrappperChange('fill', value)}
            />
            <OpacityConfig
              defaultValue={wFillOpacity}
              onChange={(value: number) =>
                handleWrappperChange('fillOpacity', value)
              }
            />
          </div>
        </>
      )}
      <div className={`${prefixCls}-header`}>边框配置</div>
      <div className={`${prefixCls}-content`}>
        <ColorConfig
          defaultValue={stroke}
          onChange={(value: string) => handleWrappperChange('stroke', value)}
        />
        <SingleConfig label="宽度">
          <InputNumber
            defaultValue={lineWidth}
            onChange={(value: number) =>
              handleWrappperChange('lineWidth', value)
            }
          />
        </SingleConfig>
        <SelectConfig
          label="样式"
          defaultValue={String(lineDash[1] / lineDash[0])}
          onChange={(value) =>
            handleWrappperChange('lineDash', [
              lineWidth,
              lineWidth * Number(value),
            ])
          }
          list={[
            { label: <LineOutlined />, value: '0' },
            { label: <SmallDashOutlined />, value: '1' },
            { label: <DashOutlined />, value: '2' },
          ]}
        />

        <OpacityConfig
          defaultValue={strokeOpacity}
          onChange={(value: number) =>
            handleWrappperChange('strokeOpacity', value)
          }
        />
      </div>
      <div className={`${prefixCls}-hr`}></div>
      {!label ? null : (
        <>
          <div className={`${prefixCls}-header`}>文本配置</div>
          <div className={`${prefixCls}-content`}>
            <ColorConfig
              defaultValue={fill}
              onChange={(value: string) => handleLabelChange('fill', value)}
            />
            <IconConfig
              Icon={BoldOutlined}
              defaultValue={fontWeight}
              values={['normal', 'bold']}
              onChange={(value: string) =>
                handleLabelChange('fontWeight', value)
              }
            />
            <IconConfig
              Icon={ItalicOutlined}
              defaultValue={fontStyle}
              values={['normal', 'italic']}
              onChange={(value: string) =>
                handleLabelChange('fontStyle', value)
              }
            />

            <OpacityConfig
              defaultValue={fillOpacity}
              onChange={(value: number) =>
                handleLabelChange('fillOpacity', value)
              }
            />
          </div>

          <div className={`${prefixCls}-content`}>
            <SingleConfig label="字号">
              <InputNumber
                defaultValue={fontSize}
                onChange={(value: number) =>
                  handleLabelChange('fontSize', value)
                }
              />
            </SingleConfig>
            <SingleConfig label="行高">
              <InputNumber
                defaultValue={lineHeight}
                onChange={(value: number) =>
                  handleLabelChange('lineHeight', value)
                }
              />
            </SingleConfig>
            <SelectConfig
              label="字体"
              span={2}
              defaultValue={fontFamily}
              list={ALLOW_FONT_FAMILY}
              onChange={(value: string) =>
                handleLabelChange('fontFamily', value)
              }
            />
          </div>
          <div className={`${prefixCls}-content`}>
            <IconListConfig
              label="垂直对齐方式"
              defaultValue={textBaseline}
              onChange={(value) => handleLabelChange('textBaseline', value)}
              list={[
                { icon: VerticalAlignTopOutlined, value: 'bottom' },
                { icon: VerticalAlignMiddleOutlined, value: 'middle' },
                { icon: VerticalAlignBottomOutlined, value: 'top' },
              ]}
              span={2}
            />
            <IconListConfig
              label="水平对齐方式"
              defaultValue={textAlign}
              onChange={(value) => handleLabelChange('textAlign', value)}
              list={[
                { icon: AlignLeftOutlined, value: 'right' },
                { icon: AlignCenterOutlined, value: 'center' },
                { icon: AlignRightOutlined, value: 'left' },
              ]}
              span={2}
            />
          </div>
        </>
      )}
    </div>
  );
};
