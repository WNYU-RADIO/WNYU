declare module 'react-textfit' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  interface TextfitProps {
    children?: ReactNode;
    className?: string;
    forceSingleModeWidth?: boolean;
    max?: number;
    min?: number;
    mode?: 'single' | 'multi';
    onReady?: () => void;
    style?: CSSProperties;
    throttle?: number;
  }

  export const Textfit: ComponentType<TextfitProps>;
  export default Textfit;
}
