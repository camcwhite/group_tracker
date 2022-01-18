import Store, { Schema } from 'electron-store';
import { SessionInfo } from './sessions';

export type StoreSchemaType = {
  sessions: SessionInfo[],
  groupNames: string[],
  participantNames: string[],
}

const storeSchema: Schema<StoreSchemaType> = {
  sessions: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        sessionID: { type: 'string' },
        groupName: { type: 'string' },
        dateStr: { type: 'string' },
        duration: { type: 'number' },
        participants: { 
          type: 'array', 
          items: { type: 'string' },
        },
      }
    }
  },
  groupNames: {
    type: 'array',
    items: {
      type: 'string',
    }
  },
  participantNames: {
    type: 'array',
    items: {
      type: 'string',
    }
  }
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
    sessions: new Array<SessionInfo>(), 
    groupNames: new Array<string>(),
    participantNames: new Array<string>(),
  }
});

export const storeGet = (key: keyof StoreSchemaType): SessionInfo[] | string[] => {
  return store.get(key);
};

export const storeSet = (key: string, value: any): void => {
  store.set(key, value);
};