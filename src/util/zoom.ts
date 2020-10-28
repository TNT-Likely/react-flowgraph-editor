import { Instance } from '@/index';

const STEP = 0.05;

export const zoomIn = () => {
  const MAX_RATIO = Instance.graph.getMaxZoom();
  const { ratio } = Instance;
  const newRatio = (ratio * 100 + STEP * 100) / 100;
  Instance.changeZoom(newRatio > MAX_RATIO ? MAX_RATIO : newRatio, true);
};

export const zoomOut = () => {
  const MIN_RATIO = Instance.graph.getMinZoom();
  const { ratio } = Instance;
  const newRatio = (ratio * 100 - STEP * 100) / 100;
  Instance.changeZoom(newRatio < MIN_RATIO ? MIN_RATIO : newRatio, true);
};

export const zoomZero = () => {
  Instance.changeZoom(1, true);
};
