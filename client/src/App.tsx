import React, { useEffect, useState, useCallback } from "react";
import {
  fetchPublicKey,
  fetchData,
  updateData,
  tamperData,
} from "./utils/api.ts";
import { verifyData } from "./utils/crypto.ts";
import { storeBackup, getBackup } from "./utils/storage.ts";

function App() {
  const [data, setData] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      const publicKey = await fetchPublicKey();
      setPublicKey(publicKey);

      const { data, signature } = await fetchData();
      setData(data);
      setSignature(signature);

      if (!getBackup()) {
        storeBackup(data, signature);
      }
    };

    initialize();
  }, []);

  const handleUpdateData = useCallback(async () => {
    storeBackup(data, signature);
    await updateData(data);
    const { data: newData, signature: newSignature } = await fetchData();
    setData(newData);
    setSignature(newSignature);
  }, [data, signature]);

  const handleTamperData = async () => {
    await tamperData(data);
    const { data: newData, signature: newSignature } = await fetchData();
    setData(newData);
    setSignature(newSignature);
    setMessage("Data tampered successfully. Try verifying it!");
  };

  const handleVerifyData = useCallback(async () => {
    try {
      const isVerified = await verifyData(publicKey, data, signature);
      setMessage(
        isVerified
          ? "Data is intact and verified."
          : "Data has been tampered with!"
      );
    } catch (error) {
      setMessage("Error verifying data.");
    }
  }, [publicKey, data, signature]);

  const handleRestoreBackup = async () => {
    const backup = getBackup();
    if (backup) {
      const { data: backupData } = backup;

      await updateData(backupData);

      const { data: newData, signature: newSignature } = await fetchData();

      setData(newData);
      setSignature(newSignature);

      storeBackup(newData, newSignature);

      setMessage("Data restored from backup.");
    } else {
      setMessage("No backup found.");
    }
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
        <button style={{ fontSize: "20px" }} onClick={handleUpdateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={handleVerifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={handleRestoreBackup}>
          Restore Backup
        </button>
        <button style={{ fontSize: "20px" }} onClick={handleTamperData}>
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
