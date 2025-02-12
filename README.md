# Tamper Proof Data

The system you are building requires user data to be tamper proof. The client (frontend application) does not want to trust the backend at all. Assume the whole backend system can be compromised.

**1. How does the client ensure that their data has not been tampered with?**

I decided to use an approach using the RSA cryptography algorithm, which is widely used for secure data transmission, based on a strategy using a public key to encrypt messages, while the private key is used to decrypt them. When the backend sends data to the client, it signs the data using its private key, creating a unique signature. The client receives both the data and the signature. Using the backend's public key, the client verifies the signature by recomputing the hash of the data and comparing it to the decrypted signature. If they match, the data is intact and has not been tampered with. This ensures that only the backend, which holds the private key, could have generated the signature, making tampering detectable. In my implementation, the private key could be stored in a secure location, such as a environment variable to increase security.

**2. If the data has been tampered with, how can the client recover the lost data?**
If the client detects tampering (i.e., the signature verification fails), it can recover the lost data using a backup mechanism. The client stores a backup of the original data and its signature locally, such as in localStorage. Alternatively, the client can use a distributed backup system or another trusted backend to store the data. When tampering is detected, the client retrieves the original data from the backup, verifies its integrity using the stored signature, and re-uploads it to the compromised backend if necessary. This ensures that even if the backend is compromised, the client can restore the original, untampered data.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. **Email your github repository to anna@bequest.com**
