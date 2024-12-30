import { VariantProps } from 'class-variance-authority';
import { layerPopupStyles } from './layerPopupStyles';
import { HTMLAttributes } from 'react';

export type LayerPopupProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof layerPopupStyles> & {
    label?: React.ReactNode;
    type?: 'confirm' | 'input';
    onConfirm?: (title: string) => void; // title 데이터 부모 컴포넌트로 올리기
  };
