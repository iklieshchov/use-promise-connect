import { useReducer, useMemo } from 'react';
import { ConnectionConfig, ConnectedPromises } from './types';
import { reducer, connectorInit } from './reducer';

export const usePromiseConnect = <T extends ConnectionConfig>(config: T): ConnectedPromises<T> => {

  const [conState, dispatch] = useReducer(reducer, connectorInit(config));

  const memorizedConfig = useMemo(() => {
    return config;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo<ConnectedPromises<T>>(() => {
    const names = Object.keys(memorizedConfig) as Array<keyof T>;
    const out = {} as ConnectedPromises<T>;
    for(let name of names) {
      const promiseFn = memorizedConfig[name];
      const key = name as string;
      const state = conState[key];
      out[name] = {
        send: async (...args: Parameters<typeof promiseFn>) => {
          const requestId = Date.now();
          dispatch({ type: 'load', key, requestId });
          try {
            const result = await promiseFn(...args as any);
            dispatch({ type: 'success', key, data: result, requestId });
          } catch(e) {
            dispatch({ type: 'error', key, error: e, requestId });
          }
        },
        cancel: () => {
          dispatch({ type: 'cancel', key, requestId: Date.now() });
        },
        ...state,
      };
    }
    return out;
  }, [conState, memorizedConfig]);
};
