const CACHE_PREFIX = "uzapme.";
const LIGHTNING_URI_KEY = "lnurl";

const hasLocalStorage = (): boolean => typeof localStorage !== "undefined";

const setCachedValue = (key: string, value: string): void => {
  if (!hasLocalStorage()) {
    return;
  }
  localStorage.setItem(`${CACHE_PREFIX}${key}`, value);``
};


const getCachedValue = (key: string): string | null | undefined => {
  if (!hasLocalStorage()) {
    return;
  }
  return localStorage.getItem(`${CACHE_PREFIX}${key}`);
};

export const getLNURLFromCache = (): string | null | undefined => 
  getCachedValue(LIGHTNING_URI_KEY);

export const setLNURLFromCache = (value: string): void => 
  setCachedValue(LIGHTNING_URI_KEY, value);
