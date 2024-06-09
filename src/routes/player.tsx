import { useParams } from '@solidjs/router';
import Hls from 'hls.js';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { Button } from '../components/common/button';
import { PhosphorIcon } from '../components/icons/phosphor';
import { Details } from '../components/player/details';
import { useFlikk } from '../context';
import type { LiveDetails } from '../lib/types';

export default function Player() {
  const params = useParams();
  const {
    instances: { chzzk },
  } = useFlikk();
  const [details, setDetails] = createSignal<LiveDetails>();
  const [following, setFollowing] = createSignal(false);
  const [ws, setWs] = createSignal<WebSocket>();
  let videoRef!: HTMLVideoElement;

  onMount(async () => {
    chzzk.getLiveDetails(params.id).then((res) => {
      if (!res.success) return;

      setDetails(res.data);

      chzzk.connectLiveChat(res.data.chatId).then((ws) => {
        setWs(ws);
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          console.log(data);
        };
      });

      const hls = new Hls();
      hls.loadSource(res.data.m3u8);
      hls.attachMedia(videoRef);
      videoRef.play();
    });
    chzzk.getFollowing(params.id).then((res) => {
      if (!res.success) return;
      setFollowing(res.data.following);
    });
  });

  onCleanup(() => ws()?.close());

  return (
    <div>
      <div class='px-4 pt-3 pb-2'>
        <Button variant='plain' class='px-2'>
          <PhosphorIcon icon='caret-left' weight='bold' class='mr-0.5' />
          <span class='relative -top-[0.5px]'>이전 페이지</span>
        </Button>
      </div>
      <div class='px-8'>
        <video ref={videoRef} class='w-full rounded-md' />
      </div>
      {details() && <Details live={details()!} following={following()} />}
    </div>
  );
}
