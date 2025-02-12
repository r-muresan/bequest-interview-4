import { Crypto } from "./crypto";
export class Cache {
  crypto: Crypto;

  constructor(crypto: Crypto) {
    this.crypto = crypto;
  }


  /**
   *  get the value from the cache
   * @param key string
   * @param defaultValue any 
   * @returns 
   */
  get(key: string, defaultValue: any = null) {
    console.info(`Getting value from cache with key: ${key}`);
    const encrypted = localStorage.getItem(key);

    console.info(`Encrypted value: ${encrypted}`);

    if (!encrypted) {
      console.info(`No value found for key: ${key}`);
      return defaultValue;
    }  

    const decrypted = this.crypto.decrypt(encrypted);

    console.info(`Decrypted value: ${decrypted}`);

    return decrypted;
  }

  /**
   * Set the value in the cache
   * @param key string
   * @param value 
   */
  async set(key: string, value: any) {
    console.info(`Setting value in cache with key: ${key}`);
    const encrypted = this.crypto.encrypt(value);

    console.info(`Encrypted value: ${encrypted}`);
    
    localStorage.setItem(key, encrypted);
  }


  /**
   * Delete the value from the cache
   * @param key string
   */
  delete(key: string) {
    console.info(`Deleting value from cache with key: ${key}`);
    localStorage.removeItem(key);
  }
}