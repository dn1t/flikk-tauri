import { ChzzkIcon } from '../icons/chzzk';
import { SOOPIcon } from '../icons/soop';
import { TwitchIcon } from '../icons/twitch';
import { Input } from './input';

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
      </div>
      <div class='px-4 mt-auto mb-3'>
        <div class='flex flex-col gap-y-2 bg-gray-8/30 p-2.5 border border-gray-8/30 rounded-[7px]'>
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
