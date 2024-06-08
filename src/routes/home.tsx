import { createVirtualizer } from '@tanstack/solid-virtual';
import { For, createEffect, createSignal, on } from 'solid-js';
import { Header } from '../components/common/header';
import { LiveCard } from '../components/home/live-card';
import { useFlikk } from '../context';
import type { Live, SOOPLive } from '../lib/types.d';

export default function Home() {
  const [refresh] = createSignal(0);
  const {
    instances: { chzzk, soop },
  } = useFlikk();
  const [lives, setLives] = createSignal<Live[]>([]);
  let listRef!: HTMLDivElement;

  const virtualizer = createVirtualizer({
    get count() {
      return Math.ceil(lives().length / 3);
    },
    getScrollElement: () => listRef,
    estimateSize: () => 305,
    overscan: 5,
  });

  createEffect(
    on(
      () => refresh(),
      async () => {
        const [chzzkLivesRes, soopLivesRes] = await Promise.all([
          chzzk.getLives(),
          soop.getLives(),
        ]);
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

  return (
    <div ref={listRef} class='h-full overflow-y-auto'>
      <Header title='홈' />
      <div class='px-8 mb-6'>
        <div
          class='relative grid grid-cols-3 gap-5 w-full'
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <For each={virtualizer.getVirtualItems()}>
            {(item) => {
              const live1 = lives()[item.index * 3];
              const live2 = lives()[item.index * 3 + 1];
              const live3 = lives()[item.index * 3 + 2];
              if (!live1 || !live2 || !live3) return;

              return (
                <>
                  <LiveCard item={item} live={live1} pos={0} />
                  <LiveCard item={item} live={live2} pos={1} />
                  <LiveCard item={item} live={live3} pos={2} />
                </>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}
