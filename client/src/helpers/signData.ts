export async function signData(privateKey: CryptoKey, data: string) {
  const encoded = new TextEncoder().encode(data);
  const signature = await window.crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    privateKey,
    encoded
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature))); // Base64 encode
}
