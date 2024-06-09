import type { VirtualItem } from '@tanstack/solid-virtual';
import { For } from 'solid-js';
import type { Live } from '../../lib/types.d';
import { ChzzkBadge, SOOPBadge } from '../common/badges';
import { A } from '@solidjs/router';

export function LiveCard(props: {
  item: VirtualItem;
  live: Live;
  pos: 0 | 1 | 2;
}) {
  return (
    <div
      class='absolute w-[calc(33.333333%_-_13.333333px)]'
      style={{
        transform: `translateX(calc(${props.pos * 100}% + ${
          props.pos * 20
        }px)) translateY(${props.item.start}px)`,
      }}
    >
      <A
        href={`/player/${props.live.platform}/${
          props.live.platform === 'chzzk'
            ? props.live.channel.id
            : props.live.platform === 'soop'
              ? `${props.live.channel.id}:${props.live.id}`
              : ''
        }`}
      >
        {props.live.thumbnail ? (
          <div
            class='flex items-end gap-x-1 aspect-video px-[5px] py-1 bg-gray-2 bg-cover bg-no-repeat bg-center border border-gray-4 rounded-xl'
            style={{ 'background-image': `url(${props.live.thumbnail})` }}
          >
            <div class='w-max flex items-center gap-x-1 px-1.5 py-1 bg-gray-2/70 backdrop-blur-sm rounded-md'>
              <div class='w-1 h-1 bg-red-9 rounded-full' />
              <div class='font-semibold text-xs text-red-9 leading-none line-clamp-2'>
                {props.live.viewers.toLocaleString()}
              </div>
            </div>
          </div>
        ) : props.live.adult ? (
          <div class='flex flex-col items-center justify-center aspect-video bg-gray-2 border border-gray-4 rounded-xl'>
            <div class='flex items-center justify-center w-[52px] aspect-square bg-gray-3 border-4 border-gray-5 rounded-full'>
              <span class='font-medium text-gray-11 text-2xl leading-none'>
                19
              </span>
            </div>
            <span class='mt-1.5 font-semibold text-gray-10 text-lg'>
              연령 제한
            </span>
          </div>
        ) : (
          <div class='flex flex-col items-center justify-center aspect-video bg-gray-2 border border-gray-4 rounded-xl'>
            <span class='font-medium text-gray-10 text-lg'>이미지 없음</span>
          </div>
        )}
      </A>
      <div class='flex gap-x-2 mt-2.5'>
        <div
          class='flex-shrink-0 w-10 h-10 bg-cover bg-no-repeat bg-center border border-gray-4 rounded-full'
          style={{
            'background-image': `url(${props.live.channel.profileImage}), url(${
              props.live.platform === 'chzzk'
                ? 'https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png?type=f120_120_na'
                : props.live.platform === 'soop'
                  ? 'https://res.afreecatv.com/images/afmain/img_thumb_profile.gif'
                  : ''
            })`,
          }}
        />
        <div>
          <A
            href={`/player/${props.live.platform}/${
              props.live.platform === 'chzzk'
                ? props.live.channel.id
                : props.live.platform === 'soop'
                  ? `${props.live.channel.id}:${props.live.id}`
                  : ''
            }`}
            class='mt-0.5 font-medium hover:text-orange-10 leading-5 line-clamp-2 cursor-pointer'
          >
            {props.live.title}
          </A>
          <div class='mt-1 font-medium text-[15px] text-gray-11 leading-[14px]'>
            {props.live.channel.name}
          </div>
          <div class='flex flex-wrap gap-1 mt-2'>
            {props.live.platform === 'chzzk' && (
              <ChzzkBadge class='w-[22px] h-[22px] rounded-lg' />
            )}
            {props.live.platform === 'soop' && (
              <SOOPBadge class='w-[22px] h-[22px] rounded-lg' />
            )}
            {props.live.platform === 'chzzk' && props.live.categoryLabel && (
              <div class='px-1.5 py-1 bg-gray-4 font-medium text-xs text-gray-11 leading-none border border-gray-4 rounded-lg'>
                {props.live.categoryLabel}
              </div>
            )}
            {props.live.platform === 'soop' && (
              <For each={props.live.categories}>
                {(category) => (
                  <div class='px-1.5 py-1 bg-gray-4 font-medium text-xs text-gray-11 leading-none border border-gray-4 rounded-lg'>
                    {category}
                  </div>
                )}
              </For>
            )}
            <For each={props.live.tags}>
              {(tag) => (
                <div class='px-1.5 py-1 bg-gray-2 font-medium text-xs text-gray-11 leading-none border border-gray-4 rounded-lg'>
                  {tag}
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
