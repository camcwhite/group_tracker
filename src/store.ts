export const storeGet =  async <T> (key: string): Promise<T> => {
  window.postMessage({
    type: 'store-get',
    data: {
      key
    }
  })
  return new Promise<T>((resolve, reject) => {
    const listener = (event: MessageEvent<any>) => {
      if (event.data.type === 'store-fulfill-get') {
        resolve(event.data.data);    
      }
    }
    window.addEventListener('message', listener, { once: true });
  })
};

export const storeSet =  async (key: string, value: any): Promise<void> => {
  window.postMessage({
    type: 'store-set',
    data: {
      key,
      value
    }
  })
  return new Promise<void>((resolve, reject) => {
    const listener = (event: MessageEvent<any>) => {
      if (event.data.type === 'store-fulfill-set') {
        resolve();    
      }
    }
    window.addEventListener('message', listener, { once: true });
  })
};
