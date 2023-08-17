import bcrypt from "bcrypt";
import CustomError from "./CustomError";

export default class Bcrypt {
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  static async compare(password: string, hash: string) {
    const compare = await bcrypt.compare(password, hash);
    if (!compare) {
      throw new CustomError(400, 'Invalid password');
    }
  }
}