# Tamper Proof Data

The system you are building requires user data to be tamper proof. The client (frontend application) does not want to trust the backend at all. Assume the whole backend system can be compromised.

**1. How does the client ensure that their data has not been tampered with?**
To ensure data integrity, I implemented two approaches. The first and most common solution, when only client-side access is available, is to store a copy of the data in localStorage, allowing verification against the current state. However, if server-side access is also available, a more robust approach would be to implement a hash-based validation system, where the server generates a hash for the stored data, and the client verifies the hash upon retrieval. This would ensure that any unauthorized modification is detected.
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**
If the data is found to be altered, I designed a recovery mechanism based on the available access. If only client-side access is possible, the system attempts to restore the last valid state stored in localStorage. However, if server-side access is available, the ideal approach would be to request the original data from the server, which could maintain a secure version and validate it using a stored hash. This ensures that corrupted or unauthorized modifications do not compromise the integrity of the application.

Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:

`npm run start` in both the frontend and backend

## To make a submission:

1. Clone the repo
2. Make a PR with your changes in your repo
3. **Email your github repository to anna@bequest.com**
