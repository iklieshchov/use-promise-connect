import { State, connectorInit, reducer } from './reducer';

describe('reducer', () => {

  const config = { name: jest.fn() };
  let state: State<typeof config>;
  
  beforeEach(() => {
    state = connectorInit(config);
  });

  it('initial value', () => {
    expect(state).toEqual({
      name: {
        loading: false,
        data: undefined,
        error: undefined,
        requestId: undefined,
      }
    });
  });

  it('load', () => {
    const nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    expect(nextState).toEqual({
      name: {
        loading: true,
        data: undefined,
        error: undefined,
        requestId: 1,
      }
    });
  });

  it('success', () => {
    let nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    nextState = reducer(nextState, { type: 'success', key: 'name', data: 42, requestId: 1 });
    expect(nextState).toEqual({
      name: {
        loading: false,
        data: 42,
        error: undefined,
        requestId: 1,
      }
    });
  });

  it('ignore success when ids not match', () => {
    let nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    nextState = reducer(nextState, { type: 'success', key: 'name', data: 42, requestId: 2 });
    expect(nextState).toEqual({
      name: {
        loading: true,
        data: undefined,
        error: undefined,
        requestId: 1,
      }
    });
  });

  it('error', () => {
    let nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    nextState = reducer(nextState, { type: 'error', key: 'name', error: new Error('oops'), requestId: 1 });
    expect(nextState).toEqual({
      name: {
        loading: false,
        data: undefined,
        error: new Error('oops'),
        requestId: 1,
      }
    });
  });

  it('ignore error when ids not match', () => {
    let nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    nextState = reducer(nextState, { type: 'error', key: 'name', error: new Error('oops'), requestId: 2 });
    expect(nextState).toEqual({
      name: {
        loading: true,
        data: undefined,
        error: undefined,
        requestId: 1,
      }
    });
  });

  it('cancel', () => {
    let nextState = reducer(state, { type: 'load', key: 'name', requestId: 1 });
    nextState = reducer(nextState, { type: 'cancel', key: 'name', requestId: 2 });
    expect(nextState).toEqual({
      name: {
        loading: false,
        data: undefined,
        error: undefined,
        requestId: 2,
      }
    });
  });
});
