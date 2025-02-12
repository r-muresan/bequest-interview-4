import React, { useCallback, useEffect, useState } from "react";
import { Crypto } from "./shared/crypto.ts";
import { Cache } from "./shared/cache.ts";

const API_URL = "http://localhost:8080";
const crypto = new Crypto();
const cache = new Cache(crypto);

function App() {
  const [data, setData] = useState<string>("");


  const fetchData = useCallback(async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    return data;
  }, []);

  const getData = useCallback(async () => {
    try {
      const data = await fetchData();
      const decryptedData = crypto.decrypt(data);
      setData(decryptedData);
      cache.set("data", decryptedData);
    } catch (error) {
      setData(cache.get("data", ""));
    }
  }, [setData, fetchData]);

  useEffect(() => {
    getData();
  }, [getData]);

  const updateData = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: crypto.encrypt(data) }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      alert("Error updating data");
      return;
    }

    if (response.status === 200) {
      alert("Data updated successfully");
    }

    await getData();
  };

  const verifyData = async () => {
    try {
      const serverData = await fetchData();

      const decryptedData = crypto.decrypt(serverData);

      if (decryptedData !== data) throw new Error("Data is not verified");

      if (data !== decryptedData) throw new Error("Data is not verified");
      
      alert("Data is verified!");
    } catch (error) {
      setData(cache.get("data", ""));
      alert(error); 
    } finally {
      document.getElementById("data")?.focus();
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
        id="data"
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
