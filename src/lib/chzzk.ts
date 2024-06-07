import { fetch } from '@tauri-apps/plugin-http';
import type { SetLogon } from '../context';
import type { Result } from './types';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

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