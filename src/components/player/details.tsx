import { createEffect, createSignal } from 'solid-js';
import type { LiveDetails } from '../../lib/types.d';
import { Button } from '../common/button';

export function Details(props: { live: LiveDetails; following: boolean }) {
  const [duration, setDuration] = createSignal('00:00:00');

  createEffect(() => {
    const interval = setInterval(() =>
      setDuration(getDifference(props.live.streamStarted)),
    );
    return () => clearInterval(interval);
  });

  return (
    <section class='flex gap-x-4 px-10 pt-5'>
      <div
        class='flex-shrink-0 w-14 h-14 bg-cover bg-no-repeat bg-center border border-gray-4 rounded-full'
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
      <div class='flex flex-col mt-0.5'>
        <span class='font-bold text-xl leading-6 line-clamp-2'>
          {props.live.title}
        </span>
        <span class='mt-0.5 text-lg text-gray-12 leading-none'>
          {props.live.channel.name}
        </span>
        <span class='mt-1.5 text-sm text-orange-10 leading-none'>
          {props.live.platform === 'chzzk'
            ? props.live.categoryLabel
            : props.live.platform === 'soop'
              ? props.live.categories
              : ''}
        </span>
        <div class='flex gap-x-1.5 mt-1'>
          <span class='text-sm text-gray-11 leading-none'>
            {props.live.viewers.toLocaleString()}명 시청 중
          </span>
          <span class='text-sm text-gray-10 leading-none'>·</span>
          <span class='text-sm text-gray-11 leading-none'>
            {duration()} 스트리밍 중
          </span>
        </div>
      </div>
      <div class='pt-1 ml-auto'>
        <Button
          variant={!props.following ? 'solid' : 'soft'}
          class='text-base px-4 py-1.5 rounded-[10px]'
        >
          {!props.following ? '팔로우' : '팔로잉'}
        </Button>
      </div>
    </section>
  );
}

function getDifference(streamStarted: Date) {
  const now = new Date();
  let h = now.getHours() - streamStarted.getHours();
  let m = now.getMinutes() - streamStarted.getMinutes();
  let s = now.getSeconds() - streamStarted.getSeconds();

  if (s < 0) {
    s += 60;
    m -= 1;
  }
  if (m < 0) {
    m += 60;
    h -= 1;
  }
  if (h < 0) {
    h += 24;
  }

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
}
