import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const initialData = "Hello World";
const sign = crypto.createSign("SHA256");
sign.update(initialData);
sign.end();
const initialSignature = sign.sign(privateKey, "base64");

const database = { data: initialData, signature: initialSignature };

app.use(cors());
app.use(express.json());

// Endpoint to get the public key
app.get("/publicKey", (req, res) => {
  res.json({ publicKey });
});

// Endpoint to get signed data
app.get("/data", (req, res) => {
  res.json({ data: database.data, signature: database.signature });
});

// Endpoint to save data
app.post("/data", (req, res) => {
  const { data } = req.body;

  // Sign the new data using the private key
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();
  const signature = sign.sign(privateKey, "base64");

  // Update the database with new data and signature
  database.data = data;
  database.signature = signature;

  res.json({ message: "Data saved successfully" });
});

// Endpoint to simulate a tampered data
app.put("/data", (req, res) => {
  const { data } = req.body;

  // Update the database with new data and and ignore the signature
  database.data = data;

  res.json({ message: "Data updated successfully" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
