import Taro from "@tarojs/taro";

type Env = "DEVELOP" | "TRIAL" | "RELEASE";
const envVersion: Env =
  Taro.getAccountInfoSync().miniProgram.envVersion.toLocaleUpperCase() as Env;

class LocalStorage {
  private readonly key: string = "";

  constructor(private _key: string) {
    this.key = `${envVersion}_${this._key}`;
  }

  static keyWithEnv(key: string) {
    return `${envVersion}_${key}`;
  }

  static getWithKey(key: string) {
    return Taro.getStorageSync(LocalStorage.keyWithEnv(key));
  }

  static clear() {
    Taro.clearStorage();
  }

  clearWithNotCurrentEnv() {}

  set(options: {
    data: string | undefined;
    complete?: (res: any) => void;
    fail?: () => void;
  }) {
    if (typeof options.data === "string") {
      Taro.setStorage({
        key: this.key,
        ...options,
      });
    }
  }

  setSync(data: string | undefined) {
    if (typeof data === "string") {
      Taro.setStorageSync(this.key, data);
    }
  }

  get(options: { complete?: () => void; fail?: () => void }) {
    return Taro.getStorage({ ...options, key: this.key });
  }

  getSync() {
    return Taro.getStorageSync(this.key);
  }

  remove(options: { complete?: () => void; fail?: () => void }) {
    Taro.removeStorage({ key: this.key, ...options });
  }

  removeSync() {
    Taro.removeStorageSync(this.key);
  }

  currentKey() {
    return this.key;
  }
}

export default LocalStorage;
