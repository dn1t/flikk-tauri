import type { JSX } from 'solid-js';
import { cn } from '../../utils';

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={cn(
        'px-3 py-1.5 bg-gray-8/20 border border-gray-8/30 focus:border-orange-9 rounded-[7px] outline-none focus:ring-2 ring-orange-9/50 text-[15px] placeholder:text-gray-10',
        props.class,
      )}
    />
  );
}
