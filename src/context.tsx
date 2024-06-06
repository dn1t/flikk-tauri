import { createContext, useContext, type ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';

interface Flikk {
  logon: {
    chzzk: string | null;
    soop: string | null;
    twitch: string | null;
  };
  actions: {
    setChzzkLogon: (logon: string | null) => void;
    setSoopLogon: (logon: string | null) => void;
    setTwitchLogon: (logon: string | null) => void;
  };
}

const FlikkContext = createContext<Flikk>({} as Flikk);

export function FlikkProvider(props: ParentProps) {
  const [logon, setLogon] = createStore<Flikk['logon']>({
    chzzk: null,
    soop: null,
    twitch: null,
  });

  const setChzzkLogon = (logon: string | null) =>
    setLogon('chzzk', () => logon);
  const setSoopLogon = (logon: string | null) => setLogon('soop', () => logon);
  const setTwitchLogon = (logon: string | null) =>
    setLogon('twitch', () => logon);

  const value = {
    logon,
    actions: { setChzzkLogon, setSoopLogon, setTwitchLogon },
  };

  return (
    <FlikkContext.Provider value={value}>
      {props.children}
    </FlikkContext.Provider>
  );
}

export function useFlikk() {
  return useContext(FlikkContext);
}
