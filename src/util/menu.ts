import { INode } from '@antv/g6/lib/interface/item';

import { MenuCode } from '@/constant';
import { IMenuColumn } from '@/interface';

export const getMenu = (node: INode | null): IMenuColumn[] => {
  const nodeData = !!node
    ? [
        {
          text: '锁定',
          code: MenuCode.Lock,
          disabled: node?.hasLocked(),
          shortcut: 'Ctrl + L',
        },
        {
          text: '解锁',
          code: MenuCode.UnLock,
          disabled: !node?.hasLocked(),
          shortcut: 'Ctrl + shift + L',
        },
      ]
    : [];

  const otherData = [
    {
      text: '全选',
      code: MenuCode.SelectAll,
      shortcut: 'Ctrl + A',
    },
  ];
  return [...nodeData, ...otherData];
};
