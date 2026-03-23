// Calls the server-side API route so the Airtable token is never exposed
// to the browser. The actual Airtable requests happen in /api/waitlist.js.

export async function fetchCount() {
  try {
    const res  = await fetch("/api/waitlist");
    const data = await res.json();
    return data.count ?? null;
  } catch {
    return null;
  }
}

export async function submitRecord(data) {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Server error ${res.status}`);
  }
  return res.json();
}
