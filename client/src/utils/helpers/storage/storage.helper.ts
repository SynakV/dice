export const setStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getStorageItem = (key: string) => {
  return localStorage.getItem(key);
};
