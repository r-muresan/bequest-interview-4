import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [hash, setHash] = useState<string>(""); // using a hash to save the data

  useEffect(() => {
    getData();
  }, []);

  const calculateHash = async (text: string) => {
    const encoder = new TextEncoder(); // converts string to Uint8Array
    const data = encoder.encode(text); // converts Uint8Array to ArrayBuffer
    const hashBuffer = await crypto.subtle.digest("SHA-256", data); // hashes the data
    return Array.from(new Uint8Array(hashBuffer)) // converts ArrayBuffer to Uint8Array
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const saveToLocalStorage = (key: string, value: string) => { // saves the last valid data
    localStorage.setItem(key, value);
  };
  
  const loadFromLocalStorage = (key: string) => { // loads the last valid data
    return localStorage.getItem(key);
  }


  const getData = async () => {
  
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data)
  };

  const updateData = async () => {
    const newHash = await calculateHash(data);

    saveToLocalStorage("lastValidData", data); // saves the last valid data before update
    setHash(newHash);
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data, hash: newHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    alert("✅ Data has been updated!");

    await getData();
  };

  // verifying using hash
  const verifyDataUsingHash = async () => {
    const response = await fetch(API_URL); // get the data
    const { hash, data } = await response.json();
    const currentHash = await calculateHash(data); // creates a new hash to see if the data is the same
    if (currentHash !== hash) { // if the hash is different
      alert("⚠️ Data has been modified!");
      // recoverData();
      recoverDataFromLocalStorage();
      return;
    }

    alert("✅ Data is valid."); // if the hash is the same
  };

  // verifying using local storage
  const verifyData = async () => {
    const response = await fetch(API_URL); // get the data
    const { data } = await response.json();
    const lastValidData = loadFromLocalStorage("lastValidData");
    if (lastValidData !== data) { // if the hash is different
      alert("⚠️ Data has been modified!");
      // recoverData();
      recoverDataFromLocalStorage();
      return;
    }

    alert("✅ Data is valid."); // if the hash is the same
  };

  
  // function to recover data if we have a backup
  const recoverData = async () => { 
    const response = await fetch(`${API_URL}/backup`);
    const { data, hash } = await response.json();
    setData(data);
    setHash(hash);
    alert("🔄 Data has been recovered!");
  };

  // function to recover data from local storage
  const recoverDataFromLocalStorage = () => {
    const lastValidData = loadFromLocalStorage("lastValidData");
    if (lastValidData) {
      setData(lastValidData);
      alert("Data has been recovered from local storage!");
      return
    }

    alert("Data has not been recovered from local storage!");
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

      <div style={{ display: "flex", gap: "20px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        {
          // just a button to text the function, but we already do it when we verify the data
        }
        <button style={{ fontSize: "20px", cursor: "pointer", background: "#00ff22" }} onClick={recoverDataFromLocalStorage}>
          Recover Data
        </button>
      </div>
    </div>
  );
}

export default App;
