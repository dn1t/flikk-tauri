import type { IconProps } from './types';

export function TwitchIcon(props: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 3300 3300'
      class={props.class}
    >
      <title>Twitch 로고</title>
      <path
        fill='#fff'
        d='m2650 1800-400 400h-400l-350 350v-350h-450V700h1600v1100Z'
      />
      <path
        fill='#9146ff'
        d='m950 500-500 500v1800h600v500l500-500h400l900-900V500H950Zm1700 1300-400 400h-400l-350 350v-350h-450V700h1600v1100Z'
      />
      <path
        fill='#9146ff'
        d='M2150 1050h200v600h-200v-600Zm-550 0h200v600h-200v-600Z'
      />
    </svg>
  );
}
