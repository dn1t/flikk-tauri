/* @refresh reload */
import Dialog from '@corvu/dialog';
import { createEffect, createMemo, createSignal, type JSX } from 'solid-js';
import { Button } from '../common/button';
import { Input } from '../common/input';
import { ChzzkLogin } from '../../lib/chzzk-login';

export const currentPageSignal = createSignal<'chzzk' | 'soop' | 'twitch'>();

export function Login(props: { open: boolean; onClose: () => void }) {
  const [currentPage] = currentPageSignal;

  const platformName = createMemo(() => {
    switch (currentPage()) {
      case 'chzzk':
        return '치지직';
      case 'soop':
        return '숲';
      case 'twitch':
        return '트위치';
    }
  });

  const loginInstance = createMemo(() => {
    switch (currentPage()) {
      case 'chzzk': {
        const instance = new ChzzkLogin();
        instance.getKeys();
        return instance;
      }
      case 'soop':
        return;
      case 'twitch':
        return;
    }
  });

  return (
    <Dialog
      open={props.open}
      onOutsidePointer={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <Dialog.Portal>
        <Dialog.Overlay class='fixed inset-0 z-50 bg-gray-8/20 backdrop-blur-sm' />
        <Dialog.Content
          as='form'
          class='fixed left-1/2 top-1/2 z-50 min-w-[18rem] flex flex-col px-5 py-3.5 bg-gray-2 border border-gray-4 rounded-[14px] outline-none -translate-x-1/2 -translate-y-1/2 duration-200 corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-1/2 corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-1/2 select-none cursor-default'
          onSubmit={
            ((e) => {
              e.preventDefault();
              e.stopPropagation();

              const formData = new FormData(e.currentTarget);
              const userId = formData.get('userId')! as string;
              const password = formData.get('password')! as string;

              console.log(userId, password);
              loginInstance()?.login(userId, password);
            }) satisfies JSX.EventHandler<HTMLFormElement, SubmitEvent>
          }
        >
          <Dialog.Label class='font-bold text-lg'>
            {platformName()} 로그인
          </Dialog.Label>
          <div class='flex flex-col mt-2'>
            <Input
              name='userId'
              label='아이디'
              placeholder='ex@mp1e'
              autofocus
            />
            <Input
              name='password'
              type='password'
              label='비밀번호'
              placeholder='p@ssw0rd'
              labelClass='mt-1'
            />
          </div>
          <div class='mt-3 flex justify-between'>
            <Dialog.Close
              as={Button}
              type='button'
              variant='plain'
              class='ml-auto mr-1.5'
              onClick={props.onClose}
            >
              취소
            </Dialog.Close>
            <Button type='submit' variant='solid'>
              로그인
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
