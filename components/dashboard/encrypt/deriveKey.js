export async function deriveEncryptionKey(pass) {
  const enc = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(pass),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const rawKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode("transferguard-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );

  return rawKey; // ArrayBuffer
}