import { cn } from '../../utils';
import { ChzzkIcon } from '../icons/chzzk';
import { SOOPIcon } from '../icons/soop';
import { TwitchIcon } from '../icons/twitch';

export function ChzzkBadge(props: { class?: string }) {
  return (
    <div
      class={cn(
        'flex items-center justify-center w-5 h-5 bg-black rounded-md',
        props.class,
      )}
    >
      <ChzzkIcon class='h-3.5' />
    </div>
  );
}

export function SOOPBadge(props: { class?: string }) {
  return (
    <div
      class={cn(
        'flex items-center justify-center w-5 h-5 bg-blue-12 rounded-md',
        props.class,
      )}
    >
      <SOOPIcon class='h-4' />
    </div>
  );
}

export function TwitchBadge(props: { class?: string }) {
  return (
    <div
      class={cn(
        'flex items-center justify-center w-5 h-5 bg-purple-12 rounded-md',
        props.class,
      )}
    >
      <TwitchIcon class='h-[18px]' />
    </div>
  );
}
