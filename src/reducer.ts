import {
  ConnectionConfig,
  PromiseFn,
  PromiseError,
  PromiseValue,
} from './types';

export type PromiseState<T extends PromiseFn> = {
  loading: boolean;
  data?: PromiseValue<T>;
  error?: PromiseError;
  requestId?: number;
}

export type State<T extends ConnectionConfig> = {
  [K in keyof T]: PromiseState<T[K]>;
}

export const connectorInit = <T extends ConnectionConfig>(props: T) => {
  const keys = Object.keys(props) as Array<keyof T>;
  let out = {} as State<T>;
  for(let key of keys) {
    out[key] = {
      loading: false,
      data: undefined,
      error: undefined,
      requestId: undefined,
    };
  } 
  return out;
};

type Load<T> = { type: 'load', key: keyof T, requestId: number };
type Success<T> = { type: 'success', key: keyof T, data?: any, requestId: number };
type Error<T> = { type: 'error', key: keyof T, error?: PromiseError, requestId: number };
type Cancel<T> = { type: 'cancel', key: keyof T, requestId: number };

export type Action<T> = Load<T> | Success<T> | Error<T> | Cancel<T>;

export const reducer = <T extends ConnectionConfig>(state: State<T>, action: Action<T>) => {
  switch(action.type) {
    case 'load': {
      return { ...state, [action.key]: {
        ...state[action.key],
        loading: true,
        requestId: action.requestId,
      }};
    }
    case 'success': {
      if (state[action.key].requestId === action.requestId) {
        return { ...state, [action.key]: {
          ...state[action.key],
          loading: false,
          data: action.data,
          error: undefined,
        }};
      }
      break;
    }
    case 'error': {
      if (state[action.key].requestId === action.requestId) {
        return { ...state, [action.key]: {
          ...state[action.key],
          loading: false,
          error: action.error,
          requestId: action.requestId,
        }};
      }
      break;
    }
    case 'cancel': {
      return { ...state, [action.key]: {
        ...state[action.key],
        loading: false,
        requestId: action.requestId,
      }};
    }
  }
  return state;
};
