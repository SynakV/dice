const domain = "http://localhost:3001";

export const getRequest = <T>(url: string): Promise<T> =>
  fetch(`${domain}/${url}`).then((r) => r.json());

export const postRequest = async <T>(url: string, { arg }: { arg: T }) => {
  return fetch(`${domain}/${url}`, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
