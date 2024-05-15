import CryptoJS from "crypto-js";
import { weAtob } from "./atob";
// 对称加密固定参数
export const CRYPTO_KEY = "cxU7UdUS819daXRKj2tWEt0zOhyfpDFV";
export const CRYPTO_IV = "kThK1SVaJ4h2aMAw";

/*
 *
 * 对称加密
 * 类型：aes-256-cbc
 * 加密步骤：1.JSON.stringify 2.encrypt加密 3.toString
 * 解密步骤：1.解base64 2.decrypt解密 3.JSON.parse
 *
 * */
const cryptoKey = CryptoJS.enc.Latin1.parse(CRYPTO_KEY);
const cryptoIV = CryptoJS.enc.Latin1.parse(CRYPTO_IV);
const cryptoConfig = {
  iv: cryptoIV,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
};

// 加密
export const encrypt = (data = {}) => {
  if (process.env.APP_DEBUG === "true" || process.env.UMI_ENV === "dev") {
    return { ...data };
  }
  const jsonData = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonData, cryptoKey, cryptoConfig); // 加密
  return { data: encrypted.toString() };
};

// 解密
export const decrypt = (base64Data) => {
  const encryptData = weAtob(base64Data); // 解base64
  const decrypted = CryptoJS.AES.decrypt(encryptData, cryptoKey, cryptoConfig); // 解密
  return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
};
