export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  message?: string;
}

export type Result<T = null> = Success<T> | Failure;

export interface BaseLive {
  platform: 'chzzk' | 'soop' | 'twitch';
  viewers: number;
  channel: {
    id: string;
    profileImage: string;
    name: string;
  };
  title: string;
  thumbnail: string | null;
  adult: boolean;
  tags: string[];
}

export type ChzzkLive = BaseLive & {
  platform: 'chzzk';
  channel: {
    verified: boolean;
  };
  categoryType: string;
  category: string;
  categoryLabel: string;
};

export type ChzzkLiveDetails = ChzzkLive & {
  m3u8: string;
  chatId: string;
  streamStarted: Date;
};

export type SOOPLive = BaseLive & {
  platform: 'soop';
  id: string;
  categories: string[];
  allowVisit: boolean;
};

export type Live = ChzzkLive | SOOPLive;

export type LiveDetails = Live & {
  m3u8: string;
  chatId: string;
  streamStarted: Date;
};
