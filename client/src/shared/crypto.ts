export class Crypto {
  key: string;
  
  constructor(key: string = 'mysecretkey') {
    this.key = key;
  }

  
  generateHash(data: string): string {
    console.info(`Generating hash for: ${data}`);
    let hash = 0;
    const combinedData = btoa(data + this.key);

    for (let i = 0; i < combinedData.length; i++) {
      const char = combinedData.charCodeAt(i);
      hash = (hash << 5) - hash + char; 
      hash = hash & hash; 
    }

    console.info(`Hash generated: ${hash}`);
   
    return hash.toString();
  }

  isValidHash(data: string, hash: string): boolean {
    console.info(`Validating hash for: ${data} with hash: ${hash}`);
    const isValid = this.generateHash(data) === hash;
    console.info(`Hash is valid: ${isValid}`);
    return isValid;
  }

  encrypt(data: string): string {
    console.info(`Encrypting data: ${data}`);
    const encodedData = btoa(data);
    console.info(`Data encoded: ${encodedData}`);
    const hash = this.generateHash(data);
    console.info(`Hash generated: ${hash}`);
    const encryptedData = `${hash}:${encodedData}`;
    console.info(`Data encrypted: ${encryptedData}`);
    return encryptedData;
  }

  decrypt(data: string): string {
    console.info(`Decrypting data: ${data}`);
    const [hash, encodedData] = data.split(':');
    console.info(`Data split: hash: ${hash}, encodedData: ${encodedData}`);
    const decodedData = atob(encodedData);
    console.info(`Data decoded: ${decodedData}`);

    if (!this.isValidHash(decodedData, hash)) {
      console.error("Data has been tampered with");
      throw new Error("Data has been tampered with");
    }

    return decodedData;
  }
}
