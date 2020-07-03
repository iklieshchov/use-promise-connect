import { usePromiseConnect } from './index';
import { renderHook, act } from '@testing-library/react-hooks'

jest.useFakeTimers();

const currentEventLoopEnd = () => {
  return new Promise(res => setImmediate(res));
}

describe('usePromiseConnect', () => {

  it('no promise', () => {
    // setup
    const { result: { current: result, error } } = renderHook(() => usePromiseConnect({}));
    // assert
    expect(result).toEqual({});
    expect(error).toBeUndefined();
  });

  it('single promise', () => {
    // setup
    const name = jest.fn(() => new Promise(r => r()));
    const { result: { current: result, error } } = renderHook(
      () => usePromiseConnect({ name })
    );
    // assert
    expect(result).toHaveProperty('name');
    expect(error).toBeUndefined();
    // check state props
    const state = result.name;
    expect(state.data).toBeUndefined();
    expect(state.error).toBeUndefined();
    expect(state.loading).toBeFalsy();
    expect(state.send).toBeDefined();
    expect(state.cancel).toBeDefined();
  });

  it('run promise with success', async () => {
    // setup
    const name = jest.fn(
      () => new Promise(r => setTimeout(
        () => r(42), 1000)
      )
    );
    const { result, rerender } = renderHook(
      () => usePromiseConnect({ name })
    );

    // action: run promise
    await act(async () => {
      result.current.name.send();
    })
    rerender();
    // assert: promise pending
    let state = result.current.name;
    expect(state.loading).toBeTruthy();

    // action: complete promise
    await act(async () => {
      jest.runAllTimers();
      rerender();
    });
    // assert
    state = result.current.name;
    expect(state.loading).toBeFalsy();
    expect(state.data).toEqual(42);
    expect(state.error).toBeUndefined();
  });

  it('run promise with error', async () => {
    // setup
    const name = jest.fn(
      () => new Promise((_, r) => setTimeout(
        () => r(new Error('oops')), 1000)
      )
    );
    const { result, rerender } = renderHook(
      () => usePromiseConnect({ name })
    );

    // action: run promise
    await act(async () => {
      result.current.name.send();
    })
    rerender();
    // assert: promise pending
    let state = result.current.name;
    expect(state.loading).toBeTruthy();

    // action: complete promise
    await act(async () => {
      jest.runAllTimers();
      rerender();
    });
    // assert
    state = result.current.name;
    expect(state.loading).toBeFalsy();
    expect(state.data).toBeUndefined();
    expect(state.error?.message).toEqual('oops');
  });
});
