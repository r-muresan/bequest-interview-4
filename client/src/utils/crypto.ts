// Clean and decode a base64 string
export const cleanAndDecodeBase64 = (base64: string) => {
  const cleaned = base64
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");

  const padding = cleaned.length % 4;
  const padded = padding ? cleaned + "=".repeat(4 - padding) : cleaned;

  const binaryString = atob(padded);
  return Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
};

// Verify the integrity of the data using the public key
export const verifyData = async (
  publicKey: string,
  data: string,
  signature: string
) => {
  if (!publicKey || !data || !signature) {
    throw new Error("No data or signature to verify.");
  }

  try {
    // Clean and decode the public key
    const publicKeyArrayBuffer = cleanAndDecodeBase64(publicKey);

    // Import the public key
    const importedPublicKey = await window.crypto.subtle.importKey(
      "spki", // Format of the public key
      publicKeyArrayBuffer, // Public key as ArrayBuffer
      { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }, // Algorithm details
      true, // Whether the key is extractable
      ["verify"] // Key usage
    );

    // Convert data to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Clean and decode the signature
    const signatureArrayBuffer = cleanAndDecodeBase64(signature);

    // Verify the signature
    return await window.crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" }, // Algorithm
      importedPublicKey, // Public key
      signatureArrayBuffer, // Signature
      dataBuffer // Data
    );
  } catch (error) {
    console.error("Error verifying data:", error);
    throw error;
  }
};
