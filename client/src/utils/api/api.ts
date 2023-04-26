export const server =
  process.env.NODE_ENV === "production"
    ? "https://dice-production.up.railway.app"
    : "http://localhost:3001";

export const getRequest = <T>(url: string): Promise<T> =>
  fetch(`${server}/${url}`).then((r) => r.json());

export const postRequest = async <T>(url: string, { arg }: { arg: T }) => {
  return fetch(`${server}/${url}`, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const IMMUTABLE_SWR_CONFIGS = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  revalidateOnMount: true,
  refreshInterval: 0,
};
