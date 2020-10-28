/** 图自定义事件 */
export const GraphCustomEvent = {
  /** 调用 add / addItem 方法之前触发 */
  onBeforeAddItem: 'beforeadditem',
  /** 调用 add / addItem 方法之后触发 */
  onAfterAddItem: 'afteradditem',
  /** 调用 remove / removeItem 方法之前触发 */
  onBeforeRemoveItem: 'beforeremoveitem',
  /** 调用 remove / removeItem 方法之后触发 */
  onAfterRemoveItem: 'afterremoveitem',
  /** 调用 update / updateItem 方法之前触发 */
  onBeforeUpdateItem: 'beforeupdateitem',
  /** 调用 update / updateItem 方法之后触发 */
  onAfterUpdateItem: 'afterupdateitem',
  /** 调用 showItem / hideItem 方法之前触发 */
  onBeforeItemVisibilityChange: 'beforeitemvisibilitychange',
  /** 调用 showItem / hideItem 方法之后触发 */
  onAfterItemVisibilityChange: 'afteritemvisibilitychange',
  /** 调用 setItemState 方法之前触发 */
  onBeforeItemStateChange: 'beforeitemstatechange',
  /** 调用 setItemState 方法之后触发 */
  onAfterItemStateChange: 'afteritemstatechange',
  /** 调用 refreshItem 方法之前触发 */
  onBeforeRefreshItem: 'beforerefreshitem',
  /** 调用 refreshItem 方法之后触发 */
  onAfterRefreshItem: 'afterrefreshitem',
  /** 调用 clearItemStates 方法之前触发 */
  onBeforeItemStatesClear: 'beforeitemstatesclear',
  /** 调用 clearItemStates 方法之后触发 */
  onAfterItemStatesClear: 'afteritemstatesclear',
  /** 布局前触发。调用 render 时会进行布局，因此 render 时会触发。或用户主动调用图的 layout 时触发 */
  onBeforeLayout: 'beforelayout',
  /** 布局完成后触发。调用 render 时会进行布局，因此 render 时布局完成后会触发。或用户主动调用图的 layout 时布局完成后触发 */
  onAfterLayout: 'afterlayout',
  /** 连线完成之后触发 */
  onAfterConnect: 'afterconnect',
  /** 堆栈发生改变 */
  onStackChange: 'stackchange',
  /** 选择节点发生改变 */
  onNodeselectchange: 'nodeselectchange',
};
