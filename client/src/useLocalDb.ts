import { useState, useEffect } from "react";

const DB_NAME = "KeyStoreDB";
const STORE_NAME = "keys";

// Opens or upgrades indexedDB
async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) =>
      resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = () => reject("Failed to open IndexedDB.");
  });
}

// Retrieves an existing key pair
async function getStoredKeyPair(): Promise<CryptoKeyPair | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get("keyPair");

    getRequest.onsuccess = () => resolve(getRequest.result?.key || null);
    getRequest.onerror = () => reject("Failed to retrieve key pair.");
  });
}

// Generates and stores a new key pair
async function generateAndStoreKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: "keyPair", key: keyPair });

    tx.oncomplete = () => resolve(keyPair);
    tx.onerror = () => reject("Failed to store key pair.");
  });
}

// Writes data to indexedDB
async function writeLocalData(id: string, data: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, data });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject("Failed to write data.");
  });
}

// Reads data from the indexedDB
async function readLocalData(id: string): Promise<string | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => resolve(getRequest.result?.data || null);
    getRequest.onerror = () => reject("Failed to read data.");
  });
}

export function useLocalDb() {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);

  useEffect(() => {
    async function init() {
      let existingKeyPair = await getStoredKeyPair().catch(() => null);
      if (!existingKeyPair) {
        existingKeyPair = await generateAndStoreKeyPair();
      }
      setKeyPair(existingKeyPair);
    }
    init();
  }, []);

  return { keyPair, writeLocalData, readLocalData };
}
