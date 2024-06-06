import type { JSX } from 'solid-js';
import { cn } from '../../utils';

export function Input(
  props: JSX.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    labelClass?: string;
  },
) {
  return (
    <label
      class={cn(
        'flex flex-col bg-gray-8/20 text-[15px] placeholder:text-gray-10 border border-gray-8/30 focus-within:border-orange-9 rounded-[7px] outline-none focus-within:ring-2 ring-orange-9/50 cursor-text group',
        props.labelClass,
      )}
    >
      {props.label && (
        <span class='px-[11px] pt-2 font-medium text-[13px] text-gray-12 group-focus-within:text-orange-10 leading-none'>
          {props.label}
        </span>
      )}
      <input
        {...props}
        class={cn(
          'px-[11px] pt-0 pb-1.5 bg-transparent outline-none',
          !props.label && 'pt-1.5',
          props.class,
        )}
      />
    </label>
  );
}
