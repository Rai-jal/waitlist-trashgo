const TOKEN        = process.env.AIRTABLE_TOKEN;
const BASE_ID      = process.env.AIRTABLE_BASE_ID;
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const TABLE_ID     = "tblEwsKJYZOC5HS5C";
const API_URL      = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

const missingEnv = ["AIRTABLE_TOKEN", "AIRTABLE_BASE_ID", "FONNTE_TOKEN"].filter(k => !process.env[k]);

// ── Simple in-memory rate limit (resets per cold start) ──────
// For persistent rate limiting across serverless instances, use Vercel KV.
const rateMap = new Map();
function isRateLimited(ip) {
  const now   = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > 60_000) { entry.count = 0; entry.start = now; }
  entry.count++;
  rateMap.set(ip, entry);
  return entry.count > 5; // max 5 submissions per minute per IP
}

// ── Input validation ─────────────────────────────────────────
const VALID_CUSTOMER_TYPES = ["Household", "Business / Shop", "Restaurant / Food Vendor", "School", "Office / Organization"];
const VALID_WASTE_TYPES     = ["Household waste", "Plastic waste", "Paper / Cardboard", "Food waste", "Mixed waste"];
const VALID_FREQUENCIES     = ["Once per week", "Twice per week", "Every two weeks", "Not sure yet"];
const VALID_QUANTITIES      = ["Small (1–2 bags)", "Medium (3–5 bags)", "Large (5+ bags)"];
const VALID_REFERRALS       = ["WhatsApp", "Facebook", "Friend / Referral", "Flyer", "Other"];

function validateBody(body) {
  const { fullName, phone, location, customerType, wasteType, wasteQuantity, frequency, referralSource } = body || {};

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) return "Invalid full name.";
  if (!phone    || typeof phone    !== "string" || phone.trim().length < 6)    return "Invalid phone number.";
  if (!location || typeof location !== "string" || location.trim().length < 2) return "Invalid location.";
  if (!Array.isArray(customerType) || !customerType.length || !customerType.every(v => VALID_CUSTOMER_TYPES.includes(v))) return "Invalid customer type.";
  if (!Array.isArray(wasteType)    || !wasteType.length    || !wasteType.every(v => VALID_WASTE_TYPES.includes(v)))        return "Invalid waste type.";
  if (!VALID_FREQUENCIES.includes(frequency))  return "Invalid pickup frequency.";
  if (!VALID_QUANTITIES.includes(wasteQuantity)) return "Invalid waste quantity.";
  if (!VALID_REFERRALS.includes(referralSource)) return "Invalid referral source.";

  return null;
}

// ── Strip everything except digits, +, spaces, dashes ────────
function sanitizePhone(phone) {
  return phone.replace(/[^\d\+\s\-]/g, "").trim();
}

async function sendWhatsApp(phone, name) {
  const message =
    `Hi ${name},\n\n` +
    `Welcome to TrashGo.\n\n` +
    `You're officially on the Early Access Waitlist.\n\n` +
    `Free waste pickup is coming soon, and you're among the first in line to experience it.\n\n` +
    `Get ready — we'll be reaching out soon with the next steps.\n\n` +
    `Let's build cleaner communities together.\n\n` +
    `— TrashGo Team`;

  const r    = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: FONNTE_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target:      sanitizePhone(phone),
      message,
      countryCode: "232", // Sierra Leone
    }),
  });
  const data = await r.json();
  return data; // returns Fonnte response for debugging
}

export default async function handler(req, res) {
  if (missingEnv.length > 0) {
    return res.status(500).json({ error: `Missing environment variables: ${missingEnv.join(", ")}` });
  }

  // Same-origin on Vercel — only needed for local dev
  const origin = req.headers.origin || "";
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET: return total signup count ──────────────────────────
  if (req.method === "GET") {
    try {
      let offset = null;
      let total  = 0;
      do {
        const url = new URL(API_URL);
        url.searchParams.set("fields[]", "Full Name");
        url.searchParams.set("pageSize", "100");
        if (offset) url.searchParams.set("offset", offset);

        const r    = await fetch(url.toString(), { headers: { Authorization: `Bearer ${TOKEN}` } });
        const data = await r.json();
        if (!r.ok) break;
        total += (data.records || []).length;
        offset = data.offset || null;
      } while (offset);

      return res.status(200).json({ count: total });
    } catch {
      return res.status(500).json({ error: "Failed to fetch count." });
    }
  }

  // ── POST: submit a new waitlist record ───────────────────────
  if (req.method === "POST") {
    // Rate limit
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    // Validate
    const validationError = validateBody(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const { fullName, phone, location, customerType, wasteType, wasteQuantity, frequency, referralSource } = req.body;

      // 1. Save to Airtable
      const r = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Full Name":        fullName.trim(),
            "Phone Number":     sanitizePhone(phone),
            "Location / Area":  location.trim(),
            "Customer Type":    customerType,
            "Waste Type":       wasteType,
            "Estimated Waste Quantity": wasteQuantity,
            "Waste Pickup Frequency":   frequency,
            "Referral Source":  referralSource,
          },
          typecast: true,
        }),
      });

      const data = await r.json();
      if (!r.ok) {
        // Expose Airtable error for debugging — revert to generic message after fixing
        return res.status(r.status).json({ error: data?.error?.message || data?.error?.type || JSON.stringify(data) });
      }

      // 2. Send WhatsApp confirmation via Fonnte
      const fonnteResult = await sendWhatsApp(phone, fullName.trim()).catch((err) => ({ error: err.message }));

      return res.status(200).json({ ...data, fonnte: fonnteResult });
    } catch {
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
}
