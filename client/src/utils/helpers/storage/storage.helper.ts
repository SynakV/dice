import { STORAGE_ITEMS } from "@utils/helpers/storage/constants";

export const setStorageItem = (key: string, value: string) => {
  if (isClient()) {
    localStorage.setItem(key, value);
  }
};

export const getStorageItem = (key: string) => {
  if (isClient()) {
    return localStorage.getItem(key);
  }
};

export const getStorageObjectItem = (key: string) => {
  if (isClient()) {
    return JSON.parse(getStorageItem(key) || "{}");
  } else {
    return {};
  }
};

export const isClient = () => {
  return typeof localStorage !== "undefined";
};

export const getCredentials = () =>
  getStorageObjectItem(STORAGE_ITEMS.CREDENTIALS);

export const setCredentials = (value: string) =>
  setStorageItem(STORAGE_ITEMS.CREDENTIALS, value);
