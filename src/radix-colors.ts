import plugin from 'tailwindcss/plugin';
import * as radixColors from '@radix-ui/colors';

export function buildConfig() {
  return {
    theme: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: 'black',
        white: 'white',
        ...Object.fromEntries(
          Object.entries(radixColors)
            .filter(([k], _, arr) => {
              if (k.includes('P3') || k.endsWith('A')) return false;
              if (!k.includes('Dark')) {
                if (Object.keys(arr).includes(`${k}Dark`)) {
                  return false;
                }
              } else {
                return true;
              }
            })
            .map(([k, v]) => [
              k.slice(0, -4),
              Object.fromEntries(
                Object.entries(v).map(([step, hex]) => [
                  step.slice(k.length - 4),
                  hex,
                ]),
              ),
            ]),
        ),
      },
    },
  };
}

export default plugin.withOptions(() => () => {}, buildConfig);
