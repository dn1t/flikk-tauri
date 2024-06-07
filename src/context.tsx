import {
  createContext,
  createEffect,
  useContext,
  type ParentProps,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { Chzzk, updateChzzkContext } from './lib/chzzk';
import { SOOP } from './lib/soop';

export type Logon = string | null;
export type SetLogon = (logon: Logon) => void;

export interface Flikk {
  instances: {
    chzzk: Chzzk;
    soop: SOOP;
    twitch: null;
  };
  logon: { chzzk: Logon; soop: Logon; twitch: Logon };
  actions: {
    instances: {
      setChzzkInstance: (instance: Chzzk) => void;
      setSoopInstance: (instance: SOOP) => void;
      setTwitchInstance: (instance: null) => void;
    };
    logon: {
      setChzzkLogon: SetLogon;
      setSoopLogon: SetLogon;
      setTwitchLogon: SetLogon;
    };
  };
}

const FlikkContext = createContext<Flikk>({} as Flikk);

export function FlikkProvider(props: ParentProps) {
  const [instances, setInstances] = createStore<Flikk['instances']>({
    chzzk: new Chzzk(),
    soop: new SOOP(),
    twitch: null,
  });
  const [logon, setLogon] = createStore<Flikk['logon']>({
    chzzk: null,
    soop: null,
    twitch: null,
  });

  const setChzzkInstance = (instance: Chzzk) =>
    setInstances('chzzk', () => instance);
  const setSoopInstance = (instance: SOOP) =>
    setInstances('soop', () => instance);
  const setTwitchInstance = (instance: null) =>
    setInstances('twitch', () => instance);

  const setChzzkLogon = (logon: string | null) =>
    setLogon('chzzk', () => logon);
  const setSoopLogon = (logon: string | null) => setLogon('soop', () => logon);
  const setTwitchLogon = (logon: string | null) =>
    setLogon('twitch', () => logon);

  const value = {
    instances,
    logon,
    actions: {
      instances: { setChzzkInstance, setSoopInstance, setTwitchInstance },
      logon: { setChzzkLogon, setSoopLogon, setTwitchLogon },
    },
  };

  createEffect(() => {
    updateChzzkContext(instances.chzzk, setChzzkLogon);
  });

  return (
    <FlikkContext.Provider value={value}>
      {props.children}
    </FlikkContext.Provider>
  );
}

export function useFlikk() {
  return useContext(FlikkContext);
}
