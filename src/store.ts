import Store, { Schema } from 'electron-store';
import { SessionInfo } from './sessions';

export type StoreSchemaType = {
  version: string,
  sessions: SessionInfo[],
  groupNames: string[],
  participantNames: string[],
}

export const STORE_KEYS: {
  SESSIONS: keyof StoreSchemaType,
  GROUP_NAMES: keyof StoreSchemaType,
  PARTICIPANT_NAMES: keyof StoreSchemaType,
} = {
  SESSIONS: 'sessions',
  GROUP_NAMES: 'groupNames',
  PARTICIPANT_NAMES: 'participantNames',
}

const store = new Store<StoreSchemaType>({
  defaults: {
    version: '0.2.0',
    sessions: new Array<SessionInfo>(), 
    groupNames: new Array<string>(),
    participantNames: new Array<string>(),
  }
});

export const storeGet = (key: keyof StoreSchemaType): SessionInfo[] | string[] | string => {
  return store.get(key);
};

export const storeSet = (key: string, value: any): void => {
  store.set(key, value);
};

export const storeObj = () => store.store;