export const server = "http://localhost:3001";

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
