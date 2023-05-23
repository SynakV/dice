export const server =
  process.env.NODE_ENV === "production"
    ? "https://dice-production.up.railway.app"
    : "http://localhost:3001";

export const getRequest = <T>(url: string): Promise<T> =>
  fetch(getUrl(url)).then((r) => r.json());

export const postRequest = <T>(url: string, arg: T) => {
  return fetch(getUrl(url), {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

const getUrl = (url: string) => `${server}/${url}`;
