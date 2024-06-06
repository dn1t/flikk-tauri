import { A, useLocation } from '@solidjs/router';
import { createMemo, type ParentProps } from 'solid-js';
import { cn } from '../../utils';
import { PhosphorIcon, type PhosphorIconName } from '../icons/phosphor';

export function Category(
  props: ParentProps<{ href: string; icon: PhosphorIconName }>,
) {
  const loc = useLocation();
  const selected = createMemo(() =>
    props.href === '/'
      ? loc.pathname === '/'
      : loc.pathname.startsWith(props.href),
  );

  return (
    <A
      href={props.href}
      class={cn(
        'flex items-center w-full px-3 py-2 border border-transparent rounded-[7px]',
        selected() && 'bg-gray-8/20 border-gray-8/30',
      )}
    >
      <PhosphorIcon icon={props.icon} class='text-orange-9' />
      <span class='ml-2 text-sm leading-none'>{props.children}</span>
    </A>
  );
}
