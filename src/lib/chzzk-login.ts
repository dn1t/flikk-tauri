import { fetch } from '@tauri-apps/plugin-http';
import { encrypt } from 'js-crypto-rsa';
import { compressToEncodedURIComponent } from 'lz-string';

const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1';
const LOGIN_URL = 'https://nid.naver.com/nidlogin.login';

interface ChzzkLoginKeys {
  sessionKey: string;
  keyName: string;
  dynamicKey: string;
  publicKey: JsonWebKey;
}

export class ChzzkLogin {
  keys?: Promise<ChzzkLoginKeys>;

  getKeys() {
    this.keys = new Promise<ChzzkLoginKeys>((res) => {
      fetch(`${LOGIN_URL}?svctype=262144`, {
        headers: { 'User-Agent': USER_AGENT },
      })
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const [sessionKey, keyName, n, e] = (
            doc.querySelector('input[name=session_keys]') as HTMLInputElement
          ).value.split(',');
          const { value: dynamicKey } = doc.querySelector(
            'input[name=dynamicKey]',
          ) as HTMLInputElement;
          const publicKey: JsonWebKey = { kty: 'RSA', e, n };

          res({ sessionKey, keyName, dynamicKey, publicKey });
        });
    });
  }

  async #getEncPw(keys: ChzzkLoginKeys, id: string, pw: string) {
    const msg = `${keys.sessionKey.length}${keys.sessionKey}${id.length}${id}${pw.length}${pw}`;
    const encrypted = await encrypt(
      new TextEncoder().encode(msg),
      keys.publicKey,
      'SHA-256',
    );
    const hex = [...encrypted]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
    return hex;
  }

  async login(id: string, pw: string) {
    const keys = await this.keys!;
    const encPw = await this.#getEncPw(keys, id, pw);
    const bvsdUUID = crypto.randomUUID();

    const encData = compressToEncodedURIComponent(
      JSON.stringify(getAnonymizedData(bvsdUUID, id, pw)),
    );
    const bvsd = JSON.stringify({ uuid: bvsdUUID, encData });

    const formData = new FormData();

    formData.append('dynamicKey', keys.dynamicKey);
    formData.append('encpw', encPw);
    formData.append('enctp', '1');
    formData.append('svctype', '262144');
    formData.append('smart_LEVEL', '-1');
    formData.append('bvsd', bvsd);
    formData.append('encnm', keys.keyName);
    formData.append('locale', 'ko_KR');
    formData.append('url', 'https://m.naver.com');

    console.log(Object.fromEntries(formData.entries()));

    const res = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'User-Agent': USER_AGENT },
      body: formData,
    });

    console.log(await res.text());
  }
}

// export async function loginChzzk(id: string, pw: string) {
//   const keyRes = await fetch('https://nid.naver.com/login/ext/keys.nhn');
//   const key = await keyRes.text();
//   const [sessionKey, keyName, n, e] = key.split(',');
//   const msg = `${sessionKey.length}${sessionKey}${id.length}${id}${pw.length}${pw}`;
//   const encrypted = await encrypt(
//     new TextEncoder().encode(msg),
//     {
//       kty: 'RSA',
//       e,
//       n,
//     },
//     'SHA-256',
//   );
//   const hex = [...encrypted]
//     .map((x) => x.toString(16).padStart(2, '0'))
//     .join('');
//   const uuid = crypto.randomUUID();
//   const encData = {
//     a: `${uuid}-0`,
//     b: '1.3.4',
//     d: [
//       { i: 'id', b: { a: [`0,${id}`] }, d: id, e: false, f: false },
//       { i: pw, e: true, f: false },
//     ],
//     h: '1f',
//     i: { a: USER_AGENT },
//   };
//   const bvsd = {
//     uuid,
//     encData: compressToEncodedURIComponent(JSON.stringify(encData)),
//   };
//   const res = await fetch('https://nid.naver.com/nidlogin.login', {
//     method: 'POST',
//     headers: {
//       'User-Agent': USER_AGENT,
//     },
//     body: JSON.stringify({
//       svctype: 1,
//       enctp: 1,
//       encnm: keyName,
//       // enc_url: 'http0X0.0000000000001P-10220.0000000.000000www.naver.com',
//       url: 'www.naver.com',
//       smart_LEVEL: '1',
//       encpw: hex,
//       bvsd,
//     }),
//   });
//   console.log(await res.text());
// }

function getAnonymizedData(bvsdUUID: string, id: string, pw: string) {
  return {
    a: `${bvsdUUID}-0`,
    b: '1.3.9',
    c: false,
    d: [
      {
        i: 'id',
        a: [],
        b: { a: [`0,${id}`], b: 0 },
        c: '',
        d: id,
        e: false,
        f: false,
      },
      { i: pw, e: true, f: false },
    ],
    e: { a: { a: 999, b: 999, c: 999 }, b: { a: 999, b: 999, c: 999 } },
    f: {
      a: { a: { a: 999, b: 999, c: 999 }, b: { a: 999, b: 999, c: 999 } },
      b: { a: { a: 999, b: 999, c: 999 }, b: { a: 999, b: 999, c: 999 } },
    },
    g: {
      a: [
        '0|422|662|324',
        '0|1|7|-1',
        '0|18|36|-7',
        '0|18|55|-13',
        '0|3|35|-8',
        '0|11|36|-7',
        '0|4|33|-6',
        '0|9|26|-4',
        '0|8|17|-3',
        '0|8|1|0',
        '0|468|1|-2',
        '0|8|4|-2',
        '0|8|3|-1',
        '0|8|10|-6',
        '0|8|19|-10',
        '0|8|25|-13',
        '0|8|32|-17',
        '0|8|36|-18',
        '0|12|43|-22',
        '0|8|46|-19',
        '0|8|45|-20',
        '0|3|41|-14',
        '0|13|34|-13',
        '0|8|28|-11',
        '0|8|20|-7',
        '0|1296|10|-9',
        '0|0|-12|11',
        '0|9|-11|11',
        '0|6|-13|14',
        '0|9|-13|16',
        '0|8|-13|16',
        '0|8|-13|18',
        '0|8|-14|19',
        '0|8|-15|15',
        '0|8|-13|16',
        '0|8|-13|16',
        '0|8|-12|14',
        '0|8|-13|12',
        '0|8|-15|11',
        '0|8|-15|9',
        '0|8|-16|8',
        '0|8|-18|6',
        '0|8|-20|3',
        '0|8|-18|0',
        '0|8|-13|-3',
        '0|8|-11|-3',
        '0|7|-7|-3',
        '0|269|-2|1',
        '0|8|0|0',
        '0|8|-1|1',
        '0|12|-1|1',
        '0|8|-2|1',
        '0|3|-1|0',
        '0|9|-4|1',
        '0|8|-1|1',
        '0|8|-2|2',
        '0|8|-1|5',
        '0|8|-2|2',
        '0|7|-2|3',
        '0|9|-1|0',
        '0|8|-1|1',
        '0|8|-4|3',
        '0|7|-2|1',
        '0|13|-3|2',
        '0|8|-4|2',
        '0|8|-2|1',
        '0|8|-6|2',
        '0|8|-8|4',
        '0|8|-9|4',
        '0|8|-8|5',
        '0|8|-8|5',
        '0|8|-6|5',
        '0|7|-7|4',
        '0|9|-5|5',
        '0|8|-4|4',
        '0|8|-4|4',
        '0|8|-4|4',
        '0|8|-5|3',
        '0|8|-5|4',
        '0|9|-4|3',
        '0|7|-4|3',
        '0|8|0|1',
        '0|8|-2|1',
        '0|8|-4|3',
        '0|8|-3|2',
        '0|8|-3|1',
        '0|8|-5|1',
        '0|8|-1|0',
        '0|8|-3|0',
        '0|8|-1|0',
        '0|8|-2|0',
        '0|24|-3|0',
        '0|8|-1|0',
        '0|8|-5|0',
        '0|8|-2|0',
        '0|8|-5|0',
        '0|8|-1|0',
        '0|8|-3|0',
        '0|8|-4|0',
        '0|8|0|0',
        '0|8|-4|1',
        '0|8|0|0',
        '0|8|-2|1',
        '0|8|-2|1',
        '0|9|-2|1',
        '0|7|-5|2',
        '0|8|-4|0',
        '0|8|-2|0',
        '0|8|-4|0',
        '0|8|-3|0',
        '0|8|-3|0',
        '0|8|-4|0',
        '0|8|-3|-2',
        '0|8|-3|-3',
        '0|9|-2|-3',
        '0|7|-3|-5',
        '0|8|-1|-5',
        '0|8|-1|-2',
        '0|8|-1|-1',
        '0|8|0|-1',
        '0|8|-2|-3',
        '0|12|0|-1',
        '0|8|-1|-2',
        '0|8|0|-1',
        '0|8|-1|-3',
        '0|8|-1|-2',
        '0|8|0|-1',
        '0|8|0|-3',
        '0|8|0|0',
        '0|8|0|0',
        '1|180|0|0',
        '2|86|0|0',
      ],
      b: 131,
      c: 792,
      d: 361,
      e: 3755,
      f: 0,
    },
    j: 142,
    h: '665af66fb8775ada968eb14d',
    i: {
      a: USER_AGENT,
      b: 'ko_KR',
      c: 24,
      d: 6,
      e: 1,
      f: 6,
      g: [2144, 1206],
      h: [2144, 1096],
      i: -540,
      j: 1,
      k: 1,
      l: 1,
      m: 'unknown',
      n: 'MacIntel',
      o: 'unknown',
      aa: [
        'WebKit built-in PDF::Portable Document Format::application/pdf~pdf,text/pdf~pdf',
      ],
      p: '665af66fb8775ada968eb14d',
      q: '665af66fb8775ada968eb14d',
      r: 'Google Inc. (Intel Inc.)~ANGLE (Intel Inc., Intel(R) UHD Graphics 630, OpenGL 4.1)',
      s: false,
      t: false,
      u: false,
      v: false,
      w: false,
      x: [0, false, false],
      aca: 'x86',
      acb: '',
      acd: 'macOS',
      ace: '14.5.0',
      acf: '125.0.6422.113',
      acg: [
        '{"brand":"Google Chrome","version":"125.0.6422.113"}',
        '{"brand":"Chromium","version":"125.0.6422.113"}',
        '{"brand":"Not.A/Brand","version":"24.0.0.0"}',
      ],
      ach: false,
      aci: false,
      ad: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      ae: 'true',
      af: 'true',
      ak: 'default|prompt',
      ag: '4',
      aj: '2144|1096',
      ah: 'false',
      ai: '50',
      am: 'landscape',
      an: 'false',
      al: '',
      y: ['Arial', 'Helvetica', 'Helvetica Neue'],
    },
  };
}
