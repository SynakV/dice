export const setStorageItem = (key: string, value: string) => {
  if (isClientLocalStorage()) {
    localStorage.setItem(key, value);
  }
};

export const getStorageItem = (key: string) => {
  if (isClientLocalStorage()) {
    return localStorage.getItem(key);
  }
};

export const getStorageObjectItem = (key: string) => {
  if (isClientLocalStorage()) {
    return JSON.parse(getStorageItem(key) || "{}");
  }
};

const isClientLocalStorage = () => {
  return typeof localStorage !== "undefined";
};
