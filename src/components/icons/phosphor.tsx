import type { icons } from '@phosphor-icons/core';
import { cn } from '../../utils';

export type PhosphorIconName = (typeof icons extends readonly (infer U)[]
  ? U
  : never)['name'];

interface PhosphorProps {
  weight?: 'regular' | 'thin' | 'light' | 'bold' | 'fill' | 'duotone';
  icon: PhosphorIconName;
  size?: number;
  color?: string;
  class?: string;
}

export function PhosphorIcon(props: PhosphorProps) {
  return (
    <i
      class={cn(
        !props.weight || props.weight === 'regular'
          ? 'ph'
          : `ph-${props.weight}`,
        `ph-${props.icon}`,
        props.class,
      )}
      style={{
        ...(props.size && { fontSize: `${props.size}px` }),
        ...(props.color && { color: props.color }),
      }}
    />
  );
}
