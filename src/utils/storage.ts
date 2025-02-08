class WebStorage {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  set(key: string, value: any, expire: number | null = null) {
    const obj = {
      value,
      time: new Date().getTime(),
      expire: expire ? new Date().getTime() + expire * 1000 : null,
    };
    this.storage.setItem(key, JSON.stringify(obj));
  }

  get(key: string) {
    const val = this.storage.getItem(key);
    if (!val) return null;
    try {
      const data = JSON.parse(val);
      const { value, expire } = data;
      if (!expire || expire >= new Date().getTime()) {
        return value;
      } else {
        this.remove(key);
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  getAll() {
    const list: Record<string, any> = {};
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) list[key] = this.get(key);
    }
    return list;
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

export default WebStorage;

export function useLocalStorage() {
  return new WebStorage(localStorage);
}

export function useSessionStorage() {
  return new WebStorage(sessionStorage);
}
