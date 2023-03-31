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
  }
};

export const isClient = () => {
  return typeof localStorage !== "undefined";
};
