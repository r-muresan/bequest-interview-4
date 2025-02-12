const API_URL = "http://localhost:8080";

// Fetch the public key from the backend
export const fetchPublicKey = async () => {
  const response = await fetch(`${API_URL}/publicKey`);
  const { publicKey } = await response.json();
  return publicKey;
};

// Fetch data and its signature from the backend
export const fetchData = async () => {
  const response = await fetch(`${API_URL}/data`);
  const { data, signature } = await response.json();
  return { data, signature };
};

// Update data on the backend
export const updateData = async (data: string) => {
  await fetch(`${API_URL}/data`, {
    method: "POST",
    body: JSON.stringify({ data }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

// Simulate data tampering
export const tamperData = async (data: string) => {
  await fetch(`${API_URL}/data`, {
    method: "PUT",
    body: JSON.stringify({ data }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
