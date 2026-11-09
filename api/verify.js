const VALID_KEYS = [
  "DICE-XXXX-1111",
  "DICE-YYYY-2222",
  "DICE-ZZZZ-3333"
  "DICE-ZZZZ-1234"
];

const UPSTASH_URL   = "https://special-python-152717.upstash.io";
const UPSTASH_TOKEN = "gQAAAAAAAlSNAAIgcDJmZDhkYTgzMWZkYmE0ODIyODRiZTliMWRkNjIxNGRjMA";

async function redisGet(key) {
  const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const data = await res.json();
  return data.result; // null veya string
}

async function redisSet(key, value) {
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ valid: false });

  const { key, deviceId } = req.body;

  if (!key || !deviceId) {
    return res.status(400).json({ valid: false, error: "Missing fields" });
  }

  const cleanKey = key.trim().toUpperCase();

  if (!VALID_KEYS.includes(cleanKey)) {
    return res.status(200).json({ valid: false });
  }

  const storedDevice = await redisGet(`key:${cleanKey}`);

  if (!storedDevice) {
    // İlk kullanım — cihazı kaydet
    await redisSet(`key:${cleanKey}`, deviceId);
    return res.status(200).json({ valid: true });
  }

  if (storedDevice === deviceId) {
    // Aynı cihaz — geçerli
    return res.status(200).json({ valid: true });
  }

  // Farklı cihaz — reddet
  return res.status(200).json({ valid: false, error: "already_used" });
}
