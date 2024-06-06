import { createSignal } from 'solid-js';
import { useFlikk } from '../../context';
import { ChzzkIcon } from '../icons/chzzk';
import { SOOPIcon } from '../icons/soop';
import { TwitchIcon } from '../icons/twitch';
import { Category } from '../sidebar/category';
import { Login, currentPageSignal } from '../sidebar/login';
import { Input } from './input';

export function Sidebar() {
  const { logon } = useFlikk();
  const [open, setOpen] = createSignal(false);
  const [, setCurrentPage] = currentPageSignal;

  function openLoginPage(platform: 'chzzk' | 'soop' | 'twitch') {
    setCurrentPage(platform);
    setOpen(true);
  }

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
            {logon.chzzk && <span class='text-sm'>{logon.chzzk}</span>}
            {!logon.chzzk && (
              <button
                type='button'
                class='text-sm text-gray-11 hover:text-orange-10'
                onClick={() => openLoginPage('chzzk')}
              >
                연결하기
              </button>
            )}
          </div>
          <div class='flex items-center gap-x-1.5'>
            <div class='flex items-center justify-center w-5 h-5 bg-blue-12 rounded-md'>
              <SOOPIcon class='h-4' />
            </div>
            {logon.soop && <span class='text-sm'>{logon.soop}</span>}
            {!logon.soop && (
              <button
                type='button'
                class='text-sm text-gray-11 hover:text-orange-10'
                onClick={() => openLoginPage('soop')}
              >
                연결하기
              </button>
            )}
          </div>
          <div class='flex items-center gap-x-1.5'>
            <div class='flex items-center justify-center w-5 h-5 bg-purple-12 rounded-md'>
              <TwitchIcon class='h-[18px]' />
            </div>
            {logon.twitch && <span class='text-sm'>{logon.twitch}</span>}
            {!logon.twitch && (
              <button
                type='button'
                class='text-sm text-gray-11 hover:text-orange-10'
                onClick={() => openLoginPage('twitch')}
              >
                연결하기
              </button>
            )}
          </div>
        </div>
      </div>
      <Login open={open()} onClose={() => setOpen(false)} />
    </section>
  );
}
