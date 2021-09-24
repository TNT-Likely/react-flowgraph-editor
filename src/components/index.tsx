import React, { PureComponent } from 'react';
import { Graph } from '@antv/g6';
import { PrefixCls } from '@/constant';
import { guid } from '@/util';
import GraphEditor from '@/graph';

import { IEditorProps, IInstance, ISelectedItems } from '@/interface';

export let Instance = {} as IInstance;
class FlowEditor extends PureComponent<IEditorProps> {
  graph: Graph = {} as Graph;
  containerId = guid();
  copyData: ISelectedItems = { nodes: new Set(), edges: new Set() };

  static defaultProps = {
    width: 1200,
    height: 600,
    ratio: 1,
    editable: true,
    behaviors: [],
  };

  state = {
    editable: this.props.editable,
  };

  constructor(props: IEditorProps) {
    super(props);
  }

  componentDidMount() {
    this.initGraph();
  }

  componentDidUpdate(preProps: IEditorProps) {
    if (this.shouldChangeSize(preProps)) {
      Instance.changeSize(this.props.width, this.props.height);
    }

    if (this.shouldZoom(preProps)) {
      Instance.changeZoom(this.props.ratio || 1);
    }

    if (this.shouldChangeData(preProps)) {
      Instance.changeData(this.props.data);
    }

    if (this.shouldChangeEditable(preProps)) {
      this.toggleEditable(this.props.editable || false);
    }
  }

  componentWillUnmount() {
    Instance.destroy?.();
  }

  render() {
    const { style } = this.props;
    const { editable } = this.state;
    const { containerId } = this;

    return (
      <div
        id={containerId}
        className={PrefixCls}
        style={{
          ...style,
          pointerEvents: editable ? 'all' : 'none',
        }}
      ></div>
    );
  }

  initGraph = () => {
    const { containerId } = this;
    Instance = new GraphEditor({ ...this.props, container: containerId });
    window._instance = Instance;
  };

  /**
   * 是否应该改变画布大小
   * @param {IEditorProps} preProps 前一个props
   */
  shouldChangeSize = (preProps: IEditorProps) => {
    const { width, height } = this.props;
    return preProps.width !== width || preProps.height !== height;
  };

  /**
   * 是否应该改变缩放比例
   * @param {object} preProps 前一个props
   */
  shouldZoom = (preProps: IEditorProps) => {
    return preProps.ratio !== this.props.ratio;
  };

  /** 是否应该改变画布数据 */
  shouldChangeData = (preProps: IEditorProps) => {
    return (
      JSON.stringify(Instance.fixData(preProps.data)) !==
      JSON.stringify(Instance.fixData(this.props.data))
    );
  };

  /** 是否应该改变画布可编辑属性 */
  shouldChangeEditable = (preProps: IEditorProps) => {
    return preProps.editable !== this.props.editable;
  };

  /**
   * 切换是否能够编辑
   * @param {boolean} can 是否可以编辑
   */
  toggleEditable = (can: boolean) => {
    const { editable } = this.state;
    const afterEditable = can !== undefined ? can : !editable;
    return new Promise((resolve) => {
      this.setState(
        {
          editable: afterEditable,
        },
        () => {
          Instance.editable = afterEditable;
        },
      );
    });
  };
}

export default FlowEditor;
