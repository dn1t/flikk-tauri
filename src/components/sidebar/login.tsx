/* @refresh reload */
import Dialog from '@corvu/dialog';
import { createEffect, createMemo, createSignal, on, type JSX } from 'solid-js';
import { useFlikk } from '../../context';
import { updateChzzkContext } from '../../lib/chzzk';
import { Button } from '../common/button';
import { Input } from '../common/input';

export const currentPageSignal = createSignal<'chzzk' | 'soop' | 'twitch'>();

export function Login(props: { open: boolean; onClose: () => void }) {
  const [currentPage] = currentPageSignal;
  const {
    instances: { chzzk },
    actions: {
      logon: { setChzzkLogon },
    },
  } = useFlikk();
  const [error, setError] = createSignal<string>();

  const platformName = createMemo(() => {
    setError();
    switch (currentPage()) {
      case 'chzzk':
        return '치지직';
      case 'soop':
        return '숲';
      case 'twitch':
        return '트위치';
    }
  });

  createEffect(
    on(
      () => props.open,
      () => setError(),
    ),
  );

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
          class='fixed left-1/2 top-1/2 z-50 w-full max-w-[22rem] flex flex-col px-5 py-3.5 bg-gray-2 border border-gray-4 rounded-[14px] outline-none -translate-x-1/2 -translate-y-1/2 duration-200 corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-1/2 corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-1/2 select-none cursor-default'
          onSubmit={
            (async (e) => {
              e.preventDefault();
              e.stopPropagation();

              const formData = new FormData(e.currentTarget);
              const key = formData.get('key')! as string;

              const res = await chzzk.login(key);
              if (!res.success) return setError(res.message);

              const updateSuccess = await updateChzzkContext(
                chzzk,
                setChzzkLogon,
              );
              if (!updateSuccess)
                return setError('알 수 없는 오류가 발생했습니다.');

              props.onClose();
            }) satisfies JSX.EventHandler<HTMLFormElement, SubmitEvent>
          }
        >
          <Dialog.Label class='font-bold text-lg'>
            {platformName()} 로그인
          </Dialog.Label>
          {currentPage() === 'chzzk' && (
            <div class='flex flex-col mt-2'>
              <Input
                name='key'
                type='number'
                label='일회용 로그인 번호'
                placeholder='123456'
                autofocus
              />
              {error() && (
                <span class='px-0.5 mt-1.5 font-medium text-[13px] text-red-10 leading-4'>
                  {error()}
                </span>
              )}
              <span class='px-0.5 mt-1.5 text-[13px] leading-4'>
                네이버앱의{' '}
                <span class='font-medium text-orange-10'>
                  메뉴 &gt; 설정 &gt; 로그인 아이디 관리 &gt; 더보기 &gt; 일회용
                  로그인 번호
                </span>
                에 보이는 번호를 입력해 주세요.
              </span>
            </div>
          )}
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
