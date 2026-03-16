// ─────────────────────────────────────────────────────────────
//  CONFIGURE AIRTABLE
//  1. Create a Personal Access Token at https://airtable.com/create/tokens
//     Scopes needed: data.records:read  data.records:write
//  2. Get your Base ID from the Airtable URL: appXXXXXXXXXXXXXX
//  3. Table must be named "Waitlist Signups" with these fields:
//       Full Name       (Single line text)
//       Phone Number    (Single line text)
//       Location        (Single line text)
//       Customer Type   (Single select)
//       Waste Type      (Single select)
//       Waste Quantity  (Single select)
//       Pickup Frequency(Single select)
//       Referral Source (Single select)
// ─────────────────────────────────────────────────────────────

const TOKEN = "REDACTED";
const BASE_ID = "appZlODSOVu1gyq72";
const TABLE = "Waitlist Users";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
  TABLE
)}`;

const isConfigured = () =>
  !TOKEN.startsWith("YOUR_") && !BASE_ID.startsWith("YOUR_");

export async function fetchCount() {
  if (!isConfigured()) return null;
  try {
    let offset = null;
    let total = 0;
    do {
      const url = new URL(API_URL);
      url.searchParams.set("fields[]", "Full Name");
      url.searchParams.set("pageSize", "100");
      if (offset) url.searchParams.set("offset", offset);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const data = await res.json();
      if (!res.ok) break;
      total += (data.records || []).length;
      offset = data.offset || null;
    } while (offset);
    return total;
  } catch {
    return null;
  }
}

export async function submitRecord(data) {
  if (!isConfigured()) throw new Error("Airtable is not configured yet.");
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        "Full Name": data.fullName,
        "Phone Number": data.phone,
        Location: data.location,
        "Customer Type": data.customerType,
        "Waste Type": data.wasteType,
        "Waste Quantity": data.wasteQuantity,
        "Pickup Frequency": data.frequency,
        "Referral Source": data.referralSource,
      },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Airtable error ${res.status}`);
  }
  return res.json();
}
