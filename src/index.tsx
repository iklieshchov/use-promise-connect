import { useReducer, useMemo } from 'react';
import { ConnectionConfig, ConnectedPromises } from './types';
import { reducer, connectorInit } from './reducer';

export const usePromiseConnect = <T extends ConnectionConfig>(config: T): ConnectedPromises<T> => {

  const [conState, dispatch] = useReducer(reducer, connectorInit(config));

  const memorizedConfig = useMemo(() => {
    return config;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const funcs = useMemo(() => {

    const names = Object.keys(memorizedConfig) as Array<keyof T>;
    const out: any = {};

    for (let name of names) {

      const key = name as string;
      const promiseFn = memorizedConfig[name];

      const send = async (...args: Parameters<typeof promiseFn>) => {
        const requestId = Date.now();
        dispatch({ type: 'load', key, requestId });
        try {
          const result = await promiseFn(...args as any);
          dispatch({ type: 'success', key, data: result, requestId });
        } catch (e) {
          dispatch({ type: 'error', key, error: e, requestId });
        }
      };

      const cancel = () => {
        dispatch({ type: 'cancel', key, requestId: Date.now() });
      };

      out[name] = { send, cancel };
    }
    return out;
  }, [memorizedConfig]);

  return useMemo<ConnectedPromises<T>>(() => {

    const names = Object.keys(memorizedConfig) as Array<keyof T>;
    const out = {} as ConnectedPromises<T>;

    for (let name of names) {
      const key = name as string;
      out[name] = {
        ...funcs[name],
        ...conState[key],
      };
    }
    return out;
  }, [conState, funcs, memorizedConfig]);
};
