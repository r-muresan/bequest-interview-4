import React, { useEffect, useState } from "react";
import { useLocalDb } from "./useLocalDb.ts";
import { signData } from "./helpers/signData.ts";
import { verifySignedData } from "./helpers/verifySignedData.ts";

const API_URL = "http://localhost:8080";

const INITIAL_DATA = "Hello World";

function App() {
  const [data, setData] = useState<string>(INITIAL_DATA);
  const [verificationMessage, setVerificationMessage] = useState<null | {
    message: string;
    color: string;
  }>(null);
  const { keyPair, readLocalData, writeLocalData } = useLocalDb();

  const onWriteInitialData = async () => {
    const signature = await signData(keyPair!.privateKey, data);
    writeLocalData("signature", signature);
    writeLocalData("data", data);
  };

  useEffect(() => {
    if (keyPair) {
      onWriteInitialData();
    } else {
      getData();
    }
  }, [keyPair]);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    if (keyPair) {
      const signature = (await readLocalData("signature")) as string;
      const verification = await verifySignedData(
        keyPair!.publicKey,
        data,
        signature
      );
      if (verification) {
        setVerificationMessage({
          message: "Data integrity checked successfully.",
          color: "#00AA00",
        });
      } else {
        setVerificationMessage({
          message: "Data is tampered. You must recover locally saved data.",
          color: "#AA0000",
        });
      }
    }
  };

  const restoreLocallySavedData = async () => {
    if (keyPair) {
      const localData = (await readLocalData("data")) as string;
      setData(localData);
    }
  };

  const readFromTamperedEndpoint = async () => {
    const response = await fetch(API_URL + "/tampered");
    const { data } = await response.json();
    setData(data);
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
        <button style={{ fontSize: "20px" }} onClick={readFromTamperedEndpoint}>
          Load Tampered Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={restoreLocallySavedData}>
          Recover Local Data
        </button>
      </div>
      {verificationMessage ? (
        <p style={{ color: verificationMessage.color }}>
          {verificationMessage.message}
        </p>
      ) : null}
    </div>
  );
}

export default App;
