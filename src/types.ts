
export type PromiseFn = (...args: any) => Promise<any>;

// config
export type ConnectionConfig = Record<string, PromiseFn>;

// utils
export type PromiseType<T> = T extends {
  then(onThen?: (value: infer U) => unknown): unknown
} ? U : T;

export type PromiseValue<T extends PromiseFn> = PromiseType<ReturnType<T>>;

// connected type
export class PromiseError extends Error { }

export type ConnectedPromises<T extends ConnectionConfig> = {
  [K in keyof T]: {
    data?: PromiseValue<T[K]>;
    send: (...args: Parameters<T[K]>) => void;
    cancel: () => void;
    loading: boolean;
    error?: PromiseError;
  };
}