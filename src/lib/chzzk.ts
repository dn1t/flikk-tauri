import { fetch } from '@tauri-apps/plugin-http';
import type { SetLogon } from '../context';
import type { ChzzkLive, ChzzkLiveDetails, Result } from './types.d';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const CHAT_SERVERS = [
  'kr-ss1.chat.naver.com',
  'kr-ss2.chat.naver.com',
  'kr-ss3.chat.naver.com',
  'kr-ss4.chat.naver.com',
  'kr-ss5.chat.naver.com',
  'kr-ss6.chat.naver.com',
  'kr-ss7.chat.naver.com',
  'kr-ss8.chat.naver.com',
  'kr-ss9.chat.naver.com',
  'kr-ss10.chat.naver.com',
];

export class Chzzk {
  async login(key: string): Promise<Result> {
    const formData = new FormData();

    formData.append('mode', 'number');
    formData.append('svctype', '1');
    formData.append('smart_LEVEL', '1');
    formData.append('locale', 'ko_KR');
    formData.append('url', 'https://chzzk.naver.com/');
    formData.append('key', key);

    const loginRes = await fetch('https://nid.naver.com/nidlogin.login', {
      method: 'POST',
      headers: { 'User-Agent': USER_AGENT },
      body: formData,
    }).then((res) => res.text());
    if (!loginRes.includes('/signin/v3/finalize'))
      return {
        success: false,
        message: '일회용 로그인 번호를 확인한 후 다시 입력해 주세요.',
      };

    const finalizeRes = await fetch(
      'https://nid.naver.com/signin/v3/finalize?url=https%3A%2F%2Fchzzk.naver.com%2F&svctype=1',
      { headers: { 'User-Agent': USER_AGENT } },
    ).then((res) => res.text());

    return {
      success: finalizeRes.includes('chzzk.naver.com'),
      data: null,
    };
  }

  async getProfile(): Promise<
    Result<{
      userIdHash: string;
      nickname: string;
      profileImage: string;
      verified: boolean;
    }>
  > {
    const res = await fetch(
      'https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus',
      { headers: { 'User-Agent': USER_AGENT } },
    );
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (data.code !== 200 || !data.content) return { success: false };
    if (
      !data.content.userIdHash ||
      !data.content.nickname ||
      !data.content.profileImageUrl
    )
      return { success: false };

    return {
      success: true,
      data: {
        userIdHash: data.content.userIdHash,
        nickname: data.content.nickname,
        profileImage: data.content.profileImageUrl,
        verified: data.content.verifiedMark,
      },
    };
  }

  async getLives(options?: { viewers: number; liveId: number }): Promise<
    Result<{
      lives: ChzzkLive[];
      next: { viewers: number; liveId: number } | null;
    }>
  > {
    const res = await fetch(
      `https://api.chzzk.naver.com/service/v1/lives?size=50&sortType=POPULAR${
        options
          ? `&concurrentUserCount=${options.viewers}&liveId=${options.liveId}`
          : ''
      }`,
      { headers: { 'User-Agent': USER_AGENT } },
    );
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (data.code !== 200 || !data.content) return { success: false };

    return {
      success: true,
      data: {
        lives: data.content.data.map(
          // biome-ignore lint/suspicious/noExplicitAny:
          (data: any) =>
            ({
              platform: 'chzzk',
              viewers: data.concurrentUserCount,
              channel: {
                id: data.channel.channelId,
                profileImage: data.channel.channelImageUrl,
                name: data.channel.channelName,
                verified: data.channel.verifiedMark,
              },
              title: data.liveTitle
                .replaceAll('&lt;', '<')
                .replaceAll('&gt;', '>'),
              thumbnail: data.liveImageUrl?.replace('{type}', '480') ?? null,
              adult: data.adult,
              categoryType: data.categoryType,
              category: data.liveCategory,
              categoryLabel: data.liveCategoryValue,
              tags: data.tags,
            }) satisfies ChzzkLive,
        ),
        next: data.content.page
          ? {
              viewers: data.content.page.next.concurrentUserCount,
              liveId: data.content.page.next.liveId,
            }
          : null,
      },
    };
  }

  async getLiveDetails(channelId: string): Promise<Result<ChzzkLiveDetails>> {
    const res = await fetch(
      `https://api.chzzk.naver.com/service/v2/channels/${channelId}/live-detail`,
      { headers: { 'User-Agent': USER_AGENT } },
    );
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (data.code !== 200 || !data.content) return { success: false };

    return {
      success: true,
      data: {
        platform: 'chzzk',
        viewers: data.content.concurrentUserCount,
        channel: {
          id: data.content.channel.channelId,
          profileImage: data.content.channel.channelImageUrl,
          name: data.content.channel.channelName,
          verified: data.content.channel.verifiedMark,
        },
        title: data.content.liveTitle
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>'),
        thumbnail: data.content.liveImageUrl?.replace('{type}', '480') ?? null,
        adult: data.content.adult,
        categoryType: data.content.categoryType,
        category: data.content.liveCategory,
        categoryLabel: data.content.liveCategoryValue,
        tags: data.content.tags,
        streamStarted: new Date(data.content.openDate),
        m3u8: JSON.parse(data.content.livePlaybackJson).media.find(
          (m: { mediaId: 'HLS' | 'LLHLS' }) => m.mediaId === 'LLHLS',
        ).path,
        chatId: data.content.chatChannelId,
      },
    };
  }

  async getFollowing(
    channelId: string,
  ): Promise<Result<{ following: boolean }>> {
    const res = await fetch(
      `https://api.chzzk.naver.com/service/v1/channels/${channelId}/my-info`,
      { headers: { 'User-Agent': USER_AGENT } },
    );
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (data.code !== 200 || !data.content) return { success: false };

    return {
      success: true,
      data: { following: data.content.following.following },
    };
  }

  async connectLiveChat(chatId: string) {
    const ws = new WebSocket(
      `https://${
        CHAT_SERVERS[Math.floor(Math.random() * CHAT_SERVERS.length)]
      }/chat`,
      ['wss'],
    );
    ws.addEventListener('open', () => {
      ws.send(
        JSON.stringify({
          ver: '2',
          cmd: 100,
          svcid: 'game',
          cid: chatId,
          bdy: {
            uid: 'e007cbf20d0bacfbc0e454913596ae6e',
            devType: 2001,
            accTkn:
              'imJWuWK0yDQeji+n6EqkhSJ8kEfSiliTQpDM6zUqi3aBD4xNP+kw0nEAiNzqp4GWlUKQWzr6M4cZO/cJmeUlXQ==',
            auth: 'SEND',
          },
          tid: 1,
        }),
      );
    });
    return ws;
  }
}

export async function updateChzzkContext(
  instance: Chzzk,
  setChzzkLogon: SetLogon,
): Promise<boolean> {
  return instance.getProfile().then((res) => {
    if (!res.success) return false;
    setChzzkLogon(res.data.nickname);
    return true;
  });
}
