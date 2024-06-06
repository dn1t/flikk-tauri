import type { JSX } from 'solid-js';
import { cn } from '../../utils';

export type ButtonVariant = 'solid' | 'soft' | 'normal' | 'plain';

export function Button(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: ButtonVariant;
  },
) {
  return (
    <button
      {...props}
      class={cn(
        'px-3 py-2 font-semibold text-sm leading-none border border-transparent rounded-lg outline-none focus:ring-2 ring-orange-9/50',
        props.variant === 'solid' && 'bg-orange-9',
        props.variant === 'soft' &&
          'bg-orange-7/20 text-orange-11 border-orange-7/30',
        props.variant === 'normal' &&
          'bg-gray-8/20 text-gray-12 focus:text-orange-10 border-gray-8/30',
        props.variant === 'plain' &&
          'text-gray-11 hover:text-orange-10 focus:text-orange-10',
        props.class,
      )}
    >
      {props.children}
    </button>
  );
}
