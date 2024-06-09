import { fetch } from '@tauri-apps/plugin-http';
import type { Result, SOOPLive } from './types';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

export class SOOP {
  async login(key: string): Promise<Result> {
    // const formData = new FormData();

    // formData.append('mode', 'number');
    // formData.append('svctype', '1');
    // formData.append('smart_LEVEL', '1');
    // formData.append('locale', 'ko_KR');
    // formData.append('url', 'https://chzzk.naver.com/');
    // formData.append('key', key);

    // const loginRes = await fetch('https://nid.naver.com/nidlogin.login', {
    //   method: 'POST',
    //   headers: { 'User-Agent': USER_AGENT },
    //   body: formData,
    // }).then((res) => res.text());
    // if (!loginRes.includes('/signin/v3/finalize'))
    //   return {
    //     success: false,
    //     message: '일회용 로그인 번호를 확인한 후 다시 입력해 주세요.',
    //   };

    // const finalizeRes = await fetch(
    //   'https://nid.naver.com/signin/v3/finalize?url=https%3A%2F%2Fchzzk.naver.com%2F&svctype=1',
    //   { headers: { 'User-Agent': USER_AGENT } },
    // ).then((res) => res.text());

    // return {
    //   success: finalizeRes.includes('chzzk.naver.com'),
    //   data: null,
    // };

    return { success: false };
  }

  async getProfile(): Promise<
    Result<{
      userIdHash: string;
      nickname: string;
      profileImage: string;
      verified: boolean;
    }>
  > {
    // const res = await fetch(
    //   'https://comm-api.game.naver.com/nng_main/v1/user/getUserStatus',
    //   { headers: { 'User-Agent': USER_AGENT } },
    // );
    // if (!res.ok) return { success: false };
    // const data = await res.json();
    // if (data.code !== 200 || !data.content) return { success: false };
    // if (
    //   !data.content.userIdHash ||
    //   !data.content.nickname ||
    //   !data.content.profileImageUrl
    // )
    //   return { success: false };

    // return {
    //   success: true,
    //   data: {
    //     userIdHash: data.content.userIdHash,
    //     nickname: data.content.nickname,
    //     profileImage: data.content.profileImageUrl,
    //     verified: data.content.verifiedMark,
    //   },
    // };

    return { success: false };
  }

  async getLives(page = 1): Promise<Result<{ lives: SOOPLive[] }>> {
    const res = await fetch(
      `https://live.afreecatv.com/api/main_broad_list_api.php?selectType=action&selectValue=all&orderType=view_cnt&lang=ko_KR&pageNo=${page}`,
      { headers: { 'User-Agent': USER_AGENT } },
    );
    if (!res.ok) return { success: false };
    const data = await res.json();
    if (!data.broad) return { success: false };

    return {
      success: true,
      data: {
        lives: data.broad.map(
          // biome-ignore lint/suspicious/noExplicitAny:
          (data: any) =>
            ({
              platform: 'soop',
              viewers: Number.parseInt(data.total_view_cnt),
              channel: {
                id: data.user_id,
                profileImage: `https://stimg.afreecatv.com/LOGO/${data.user_id.slice(
                  0,
                  2,
                )}/${data.user_id}/m/${data.user_id}.webp`,
                name: data.user_nick,
              },
              id: data.broad_no,
              title: data.broad_title
                .replaceAll('&lt;', '<')
                .replaceAll('&gt;', '>'),
              thumbnail: `https:${data.broad_thumb}`,
              adult: data.broad_grade.toString() === '19',
              categories: data.category_tags,
              tags: data.hash_tags,
              allowVisit: data.visit_broad_type.toString() === '1',
            }) satisfies SOOPLive,
        ),
      },
    };
  }
}

// export async function updateChzzkContext(
//   instance: Chzzk,
//   setChzzkLogon: SetLogon,
// ): Promise<boolean> {
//   return instance.getProfile().then((res) => {
//     if (!res.success) return false;
//     setChzzkLogon(res.data.nickname);
//     return true;
//   });
// }
