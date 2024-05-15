import Taro from "@tarojs/taro";
import { encode } from "base64-arraybuffer";
import { IGeneralKeyValue } from "@/types/common";

const toString = Object.prototype.toString;

export function isWebUrl(url: string) {
  return /^(http(s)?:\/\/)\w/.test(url);
}

export function objectKeyToHump(name: string) {
  return name.replace(/\.(\w)/g, function (_all, letter) {
    return letter.toUpperCase();
  });
}

export function header<T = any>(arr?: T[]): T | null {
  if (!arr) {
    return null;
  }
  if (arr.length === 0) {
    return null;
  }

  return [...arr][0] as T;
}

export function pop<T = any>(arr?: T[]): T | null {
  if (!arr) {
    return null;
  }
  return [...arr].pop() as T;
}

export function queryString(str: string) {
  let params = str.split("?")[1];
  let param = params.split("&");
  let obj: Record<string, any> = {};
  for (let i = 0; i < param.length; i++) {
    let paramsA = param[i].split("=");
    let key = paramsA[0];
    let value = paramsA[1];

    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export function noOpen() {
  Taro.showToast({ title: "暂未开放", icon: "none", mask: true });
}

export async function getWxLocation(type?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    Taro.getLocation({
      type: type ? type : "wgs84",
      success(res) {
        if (res.errMsg === "getLocation:ok") {
          resolve(res);
        }
      },
      fail() {
        Taro.getSetting({
          success: (res) => {
            if (!res.authSetting?.["scope.userLocation"]) {
              Taro.showModal({
                title: "获取定位失败",
                confirmText: "去设置",
                cancelText: "取消",
                success: (res) => {
                  if (res.confirm) {
                    Taro.openSetting();
                  }
                },
              });
              reject(false);
            }
          },
        });
      },
    });
  });
}

export function filterEmptyValueWithObject(value: Record<string, any>) {
  const res = {};
  Object.keys(value).forEach((i) => {
    if (!(value[i] === "" || value[i] === null || value[i] === undefined)) {
      res[i] = value[i];
    }
  });
  return res as typeof value;
}

export function filterTaroQuery<T>(value: Record<string, any>) {
  const res = {};
  Object.keys(value).forEach((i) => {
    if (!i.startsWith("$")) {
      res[i] = value[i];
    }
  });

  return res as T;
}

export function isDate(val: any): val is Date {
  return toString.call(val) === "[object Date]";
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === "[object Object]";
}

export function isFormData(val: any): val is FormData {
  return typeof val !== "undefined" && val instanceof FormData;
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null);

  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        } else {
          result[key] = val;
        }
      });
    }
  });

  return result;
}

function encodeString(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function queryStringify(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
) {
  if (!params) {
    return url;
  }
  params = filterEmptyValueWithObject(params);
  let serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else {
    const parts: string[] = [];
    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val === null || typeof val === "undefined") {
        return;
      }
      let values: any[];
      if (Array.isArray(val)) {
        values = val;
        key += "[]";
      } else {
        values = [val];
      }
      values.forEach((val) => {
        if (isDate(val)) {
          val = val.toISOString();
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val);
        }
        parts.push(`${encodeString(key)}=${encodeString(val)}`);
      });
    });

    serializedParams = parts.join("&");
  }

  if (serializedParams) {
    const markIndex = url.indexOf("#");
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }

    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

export function filerWithCondition<T = any>(
  data: T[],
  condition: keyof T | ((item: T) => boolean)
): T[] {
  return data.filter((i) => {
    if (typeof condition === "string") {
      return !!i[condition];
    }

    if (typeof condition === "function") {
      return condition(i);
    }
  });
}

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  return encode(arrayBuffer);
}

export function paramsStringify(
  params: { [key: string]: any } | { [key: string]: any }[]
) {
  if (!params) {
    return {};
  }
  if (Array.isArray(params)) {
    // @ts-ignore
    return params.reduce((p, c) => ({ ...p, ...c }));
  }
  return { ...params };
}

/**
 * 手机号码格式化
 * @example telephoneFormat(13222220909) => 132****0909
 * @param value 手机号
 * @param start 起始位置，默认下标为3
 * @param slide 向后的位数，默认后4位
 * @param padding 填充物，默认为*
 */
export function telephoneFormat(
  value: string,
  start: number = 3,
  slide: number = 4,
  padding: string = "*"
): string {
  const startReg = "(\\d{" + start + "})";
  const paddingContent = new Array(
    slide > value.length ? value.length - start : slide
  )
    .fill(padding)
    .join("");
  let reg = "";
  let replaceValue = "";
  if (slide < value.length) {
    const end =
      slide > value.length ? value.length : value.length - start - slide;
    reg = startReg + "\\d{" + slide + "}" + "(\\d{" + end + "})";
    replaceValue = `$1${paddingContent}$2`;
  }
  if (slide >= value.length) {
    reg = startReg + "\\d{" + (value.length - start) + "}";
    replaceValue = `$1${paddingContent}`;
  }
  const regExp = new RegExp(reg);
  return value.replace(regExp, replaceValue);
}

export function parseMiniParams(query: any) {
  const q: any = {};
  Object.keys(query).forEach((i) => {
    const v = decodeURIComponent(query[i]);
    q[i] = pop<string>(v.split("/"));
  });
  return q;
}

export function generateArray<T = number>(
  min: number,
  max: number,
  interval: number,
  iterators?: (i: number) => any
): T[] {
  const arr: T[] = [];
  for (let i = min; i <= max; i += interval) {
    arr.push(iterators?.(i) || i);
  }
  return arr;
}

export function getValueWithObject(key: string, value: any) {
  const keys = key.indexOf(".") > -1 ? key.split(".") : [key];
  let root = value;
  try {
    keys.forEach((key) => {
      if (root[key]) {
        root = root[key];
      } else {
        root = undefined;
      }
    });
  } catch (e) {
    console.log("configDictionaryWithKey error", e);
  }

  return (Array.isArray(root) ? root : [root]) as IGeneralKeyValue[];
}
