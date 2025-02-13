import crypto from "crypto";

export function generateRandomString() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.randomBytes(20); // Generate random bytes

  return Array.from(
    randomValues,
    (byte: number) => charset[byte % charset.length]
  ).join("");
}
