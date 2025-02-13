export async function verifySignedData(
  publicKey: CryptoKey,
  data: string,
  signatureBase64: string
) {
  const encoded = new TextEncoder().encode(data);
  const signature = Uint8Array.from(atob(signatureBase64), (c) =>
    c.charCodeAt(0)
  );

  return await window.crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    publicKey,
    signature,
    encoded
  );
}
