import { Scrollbars } from 'solid-custom-scrollbars';
import { For, createEffect, createSignal, on } from 'solid-js';
import { ChzzkBadge, SOOPBadge } from '../components/common/badges';
import { Header } from '../components/common/header';
import { useFlikk } from '../context';
import type { Live, SOOPLive } from '../lib/types.d';

export default function Home() {
  const [refresh] = createSignal(0);
  const {
    instances: { chzzk, soop },
  } = useFlikk();
  const [lives, setLives] = createSignal<Live[]>([]);

  createEffect(
    on(
      () => refresh(),
      async () => {
        const [chzzkLivesRes, soopLivesRes] = await Promise.all([
          chzzk.getLives(),
          soop.getLives(),
        ]); //300
        const result: Live[] = [];

        if (chzzkLivesRes.success) result.push(...chzzkLivesRes.data.lives);
        if (soopLivesRes.success) result.push(...soopLivesRes.data.lives);

        result.sort((a, b) => b.viewers - a.viewers);
        setLives(result);

        async function updateChzzk(
          depth: number,
          options: {
            viewers: number;
            liveId: number;
          } | null,
        ) {
          const res = await chzzk.getLives(options ?? undefined);
          if (!res.success || !res.data.next) return;

          setLives((prev) =>
            [...prev, ...res.data.lives].toSorted(
              (a, b) => b.viewers - a.viewers,
            ),
          );
          if (depth === 1) return;
          return await updateChzzk(depth - 1, res.data.next);
        }
        if (chzzkLivesRes.success) updateChzzk(14, chzzkLivesRes.data.next);

        Promise.all(
          new Array(14).fill(null).map((_, i) => soop.getLives(i + 2)),
        ).then((reses) => {
          const result: SOOPLive[] = [];
          for (const res of reses) {
            if (res.success) result.push(...res.data.lives);
          }
          setLives((prev) =>
            [...prev, ...result].toSorted((a, b) => b.viewers - a.viewers),
          );
        });
      },
    ),
  );

  createEffect(() => {
    console.log(lives().length);
  });

  return (
    <Scrollbars
      class='max-h-64 h-full overflow-y-auto'
      renderThumbVertical={(props) => <div {...props} class='bg-gray-6' />}
      autoHide={true}
    >
      <Header title='홈' />
      <div class='grid grid-cols-3 gap-5 px-8 mb-6'>
        <For each={lives()}>
          {(live) => {
            return (
              <div>
                {live.thumbnail ? (
                  <>
                    <div
                      class='flex items-end gap-x-1 aspect-video px-[5px] py-1 bg-gray-2 bg-cover bg-no-repeat bg-center border border-gray-4 rounded-xl'
                      style={{ 'background-image': `url(${live.thumbnail})` }}
                    >
                      <div class='w-max flex items-center gap-x-1 px-1.5 py-1 bg-gray-2/70 backdrop-blur-sm rounded-md'>
                        <div class='w-1 h-1 bg-red-9 rounded-full' />
                        <div class='font-semibold text-xs text-red-9 leading-none line-clamp-2'>
                          {live.viewers.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </>
                ) : live.adult ? (
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
                    <span class='font-medium text-gray-10 text-lg'>
                      이미지 없음
                    </span>
                  </div>
                )}
                <div class='flex gap-x-2 mt-2.5'>
                  <div
                    class='flex-shrink-0 w-10 h-10 bg-cover bg-no-repeat bg-center border border-gray-4 rounded-full'
                    style={{
                      'background-image': `url(${
                        live.channel.profileImage
                      }), url(${
                        live.platform === 'chzzk'
                          ? 'https://ssl.pstatic.net/cmstatic/nng/img/img_anonymous_square_gray_opacity2x.png?type=f120_120_na'
                          : live.platform === 'soop'
                            ? 'https://res.afreecatv.com/images/afmain/img_thumb_profile.gif'
                            : ''
                      })`,
                    }}
                  />
                  <div>
                    <div class='mt-0.5 font-medium leading-5 line-clamp-2'>
                      {live.title}
                    </div>
                    <div class='mt-1 font-medium text-[15px] text-gray-11 leading-[14px]'>
                      {live.channel.name}
                    </div>
                    <div class='flex flex-wrap gap-1 mt-2'>
                      {live.platform === 'chzzk' && (
                        <ChzzkBadge class='w-[22px] h-[22px] rounded-lg' />
                      )}
                      {live.platform === 'soop' && (
                        <SOOPBadge class='w-[22px] h-[22px] rounded-lg' />
                      )}
                      {live.platform === 'chzzk' && live.categoryLabel && (
                        <div class='px-1.5 py-1 bg-gray-4 font-medium text-xs text-gray-11 leading-none border border-gray-4 rounded-lg'>
                          {live.categoryLabel}
                        </div>
                      )}
                      {live.platform === 'soop' && (
                        <For each={live.categories}>
                          {(category) => (
                            <div class='px-1.5 py-1 bg-gray-4 font-medium text-xs text-gray-11 leading-none border border-gray-4 rounded-lg'>
                              {category}
                            </div>
                          )}
                        </For>
                      )}
                      <For each={live.tags}>
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
          }}
        </For>
      </div>
    </Scrollbars>
  );
}
