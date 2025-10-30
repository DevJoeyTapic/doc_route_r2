const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchData() {
  const res = await fetch(`${API_BASE_URL}/api/data/`);
  return res.json();
}
