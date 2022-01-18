import Store from 'electron-store';

const store = new Store({
  defaults: {
    sessions: {},
    groupNames: [],
    participantNames: [],
  }
});

export const storeGet = (key: string): unknown => {
  return store.get(key);
};

export const storeSet = (key: string, value: any): void => {
  store.set(key, value);
};
