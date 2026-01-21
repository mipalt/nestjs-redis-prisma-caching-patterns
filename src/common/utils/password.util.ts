import * as a2 from 'argon2';

export class PasswordUtil {
  static async hash(pw: string): Promise<string> {
    return a2.hash(pw, {
      type: a2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  static async verify(hash: string, plain: string): Promise<boolean> {
    return a2.verify(hash, plain);
  }
}
