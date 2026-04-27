const crypto = require("crypto");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { email, reading_id } = req.body;
  if (!email || !reading_id) return res.status(400).json({ error: "email and reading_id required" });

  const salt = process.env.INTERNAL_SALT;
  if (!salt) return res.status(500).json({ error: "Salt not configured" });

  const pseudonymous_id = crypto
    .createHash("sha256")
    .update(email.toLowerCase().trim() + salt)
    .digest("hex");

  const client_access_token = "rtk_" + crypto
    .createHash("sha256")
    .update(reading_id + email.toLowerCase().trim() + salt + "access")
    .digest("hex")
    .substring(0, 32);

  return res.status(200).json({ pseudonymous_id, client_access_token });
};
