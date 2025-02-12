import React, { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetchPublicKey();
    getData();
  }, []);

  // Fetch the public key from the backend
  const fetchPublicKey = async () => {
    const response = await fetch(`${API_URL}/publicKey`);
    const { publicKey } = await response.json();
    setPublicKey(publicKey);
  };

  // Fetch data and its signature from the backend
  const getData = async () => {
    const response = await fetch(`${API_URL}/data`);
    const { data, signature } = await response.json();
    setData(data);
    setSignature(signature);
    if (!localStorage.getItem("backupData")) {
      localStorage.setItem("backupData", JSON.stringify({ data, signature }));
    }
  };

  const updateData = useCallback(async () => {
    // Store data and signature in localStorage as backup
    localStorage.setItem("backupData", JSON.stringify({ data, signature }));

    await fetch(`${API_URL}/data`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  }, [data, signature]);

  const tamperData = async () => {
    await fetch(`${API_URL}/data`, {
      method: "PUT",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData(); // Refresh the data after tampering
    setMessage("Data tampered successfully. Try verifying it!");
  };

  const cleanAndDecodeBase64 = (base64: string) => {
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
  const verifyData = useCallback(async () => {
    if (!publicKey || !data || !signature) {
      setMessage("No data or signature to verify.");
      return;
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
      console.log({ signature });
      // Verify the signature
      const isVerified = await window.crypto.subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" }, // Algorithm
        importedPublicKey, // Public key
        signatureArrayBuffer, // Signature
        dataBuffer // Data
      );

      if (isVerified) {
        setMessage("Data is intact and verified.");
      } else {
        setMessage("Data has been tampered with!");
      }
    } catch (error) {
      console.error("Error verifying data:", error);
      setMessage("Error verifying data.");
    }
  }, [publicKey, data, signature]);

  // Restore data from localStorage backup
  const restoreBackup = async () => {
    const backup = localStorage.getItem("backupData");
    if (backup) {
      const { data: backupData, signature: backupSignature } =
        JSON.parse(backup);
      console.log({ backupSignature });

      // Update the frontend state with the restored data and signature
      setData(backupData);
      setSignature(backupSignature);
      setMessage("Data restored from backup.");
    } else {
      setMessage("No backup found.");
    }
    await updateData();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={restoreBackup}>
          Restore Backup
        </button>
        <button style={{ fontSize: "20px" }} onClick={tamperData}>
          Tamper Data
        </button>
      </div>

      {message && (
        <div style={{ fontSize: "20px", color: "red" }}>{message}</div>
      )}
    </div>
  );
}

export default App;
