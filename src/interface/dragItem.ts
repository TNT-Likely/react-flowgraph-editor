export interface IDragItemProps {
  className?: string;
  style?: React.CSSProperties;
  type?:
    | 'flowRect'
    | 'flowRoundRect'
    | 'flowCircle'
    | 'flowDiamond'
    | 'flowText';
}

export type TDragItemMouseEvent =
  | React.MouseEvent<HTMLDivElement, MouseEvent>
  | MouseEvent;
