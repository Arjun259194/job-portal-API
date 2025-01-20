import bcrypt from "bcrypt";

interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export default class BnryptPasswordHasher implements PasswordHasher {
  constructor(private salt: number = 12) {}

  public async hash(password: string): Promise<string> {
    if (!password) throw new Error("Password can't be empty");
    try {
      return await bcrypt.hash(password, this.salt);
    } catch (error) {
      console.error("Error while hashing password,", error);
      throw new Error("Password hashing failed");
    }
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    if (!password) throw new Error("Password can't be empty");
    if (!hash) throw new Error("Hash can't be empty");

    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error("Error while hashing password,", error);
      throw new Error("Password hashing failed");
    }
  }
}
