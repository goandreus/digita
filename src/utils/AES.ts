import CryptoJS from 'crypto-js';
import {Buffer} from 'buffer';

export const hexaToBase64 = (input: string) => {
  return Buffer.from(input, 'hex').toString('base64');
};

const getKeys = (secure_key: string) => {
  const ENCRYPT_KEY = secure_key ?? 'NOT_FOUND';

  const Utf8 = CryptoJS.enc.Utf8;
  const iv = CryptoJS.enc.Latin1.parse('');
  const key = CryptoJS.enc.Latin1.parse(ENCRYPT_KEY);
  return {
    Utf8,
    iv,
    key,
  };
};

export const encrypt = (text: string, encryptText: string) => {
  const {iv, key} = getKeys(encryptText);
  try {
    const enc = CryptoJS.AES.encrypt(text, key, {iv: iv}).toString();
    return enc;
  } catch (error) {
    console.log('ERROR_ENCRYPTING: ', error);
    return null;
  }
};

export const encryptWithIV = (
  text: string,
  encryptText: string,
  ivString: string,
) => {
  const {key} = getKeys(encryptText);
  let iv = CryptoJS.enc.Latin1.parse(ivString);
  try {
    const enc = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
    }).toString();
    return enc;
  } catch (error) {
    console.log('ERROR_ENCRYPTING: ', error);
    return '';
  }
};

export const decrypt = (cipherText: string, encryptText: string) => {
  const {Utf8, iv, key} = getKeys(encryptText);
  try {
    const ctx = CryptoJS.enc.Base64.parse(cipherText);
    const enc = CryptoJS.lib.CipherParams.create({ciphertext: ctx});
    const dec = CryptoJS.AES.decrypt(enc, key, {iv: iv}).toString(Utf8);
    return JSON.parse(dec);
  } catch (error) {
    console.log('ERROR_DECRYPTING: ', error);
    return null;
  }
};

export const decryptText = (cipherText: string, encryptText: string) => {
  const {Utf8, iv, key} = getKeys(encryptText);
  try {
    const ctx = CryptoJS.enc.Base64.parse(cipherText);
    const enc = CryptoJS.lib.CipherParams.create({ciphertext: ctx});
    const dec = CryptoJS.AES.decrypt(enc, key, {iv: iv}).toString(Utf8);
    return dec;
  } catch (error) {
    console.log('ERROR_DECRYPTING: ', error);
    return null;
  }
};
