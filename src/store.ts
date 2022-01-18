import Store from 'electron-store';

const store = new Store();

export const storeGet = (key: string): unknown => {
  return store.get(key);
  // window.postMessage({
  //   type: 'store-get',
  //   data: {
  //     key
  //   }
  // })
  // return new Promise<T>((resolve, reject) => {
  //   const listener = (event: MessageEvent<any>) => {
  //     if (event.data.type === 'store-fulfill-get') {
  //       console.log('Got...');
  //       resolve(event.data.data);    
  //     }
  //   }
  //   window.addEventListener('message', listener, { once: true });
  // })
};

export const storeSet = (key: string, value: any): void => {
  store.set(key, value);
  // window.postMessage({
  //   type: 'store-set',
  //   data: {
  //     key,
  //     value
  //   }
  // })
  // return new Promise<void>((resolve, reject) => {
  //   const listener = (event: MessageEvent<any>) => {
  //     if (event.data.type === 'store-fulfill-set') {
  //       resolve();    
  //     }
  //   }
  //   window.addEventListener('message', listener, { once: true });
  // })
};
