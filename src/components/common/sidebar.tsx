import { A, useLocation } from '@solidjs/router';
import { createMemo, type ParentProps } from 'solid-js';
import { cn } from '../../utils';
import { ChzzkIcon } from '../icons/chzzk';
import { PhosphorIcon, type PhosphorIconName } from '../icons/phosphor';
import { SOOPIcon } from '../icons/soop';
import { TwitchIcon } from '../icons/twitch';
import { Input } from './input';

function Category(
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

export function Sidebar() {
  return (
    <section class='flex flex-col w-60 h-screen'>
      <div
        class='flex items-center gap-x-1 px-4 pt-12 pb-2'
        data-tauri-drag-region
      >
        <img
          src='/flikk.png'
          alt='Flikk 로고'
          class='w-7 h-7 pointer-events-none'
        />
        <h1 class='font-semibold text-2xl pointer-events-none'>Flikk</h1>
      </div>
      <div class='flex flex-col px-4'>
        <Input placeholder='검색' />
        <div class='flex flex-col mt-4'>
          <Category href='/' icon='house'>
            홈
          </Category>
          <Category href='/vod' icon='video'>
            VOD
          </Category>
          <Category href='/categories' icon='squares-four'>
            카테고리
          </Category>
        </div>
      </div>
      <div class='px-4 mt-auto mb-3'>
        <div class='flex flex-col gap-y-2 bg-gray-8/20 p-2.5 border border-gray-8/30 rounded-[7px]'>
          <div class='flex items-center gap-x-1.5'>
            <div class='flex items-center justify-center w-5 h-5 bg-black rounded-md'>
              <ChzzkIcon class='h-3.5' />
            </div>
            <span class='text-sm'>CHZZK</span>
          </div>
          <div class='flex items-center gap-x-1.5'>
            <div class='flex items-center justify-center w-5 h-5 bg-blue-12 rounded-md'>
              <SOOPIcon class='h-4' />
            </div>
            <span class='text-sm'>SOOP</span>
          </div>
          <div class='flex items-center gap-x-1.5'>
            <div class='flex items-center justify-center w-5 h-5 bg-purple-12 rounded-md'>
              <TwitchIcon class='h-[18px]' />
            </div>
            <span class='text-sm'>TWITCH</span>
          </div>
        </div>
      </div>
    </section>
  );
}
