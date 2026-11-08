const KEYS = [
  "DICE-XXXX-1111",
  "DICE-YYYY-2222",
  "DICE-ZZZZ-3333"
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, error: "Method not allowed" });
  }

  const { key } = req.body;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ valid: false, error: "No key provided" });
  }

  const isValid = KEYS.includes(key.trim().toUpperCase());

  return res.status(200).json({ valid: isValid });
}
