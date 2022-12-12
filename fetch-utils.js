const BASE_URL = "http://localhost:7890";

export async function fetchAffirmations() {
  const res = await fetch(`${BASE_URL}/api/v1/affirmations`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    // eslint-disable-next-line no-console
    console.error(data.message);
  }
}
