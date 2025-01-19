import jwt from "jsonwebtoken";
import z from "zod";

export type AuthTokenPayload = z.infer<typeof AuthToken.schema>;

export default class AuthToken {
  private static readonly SECRET: string = process.env.JWT_SECRET;

  static readonly schema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
  });

  private expireIn: number | string;

  constructor(public data: AuthTokenPayload) {
    this.expireIn = "3 days";
    AuthToken.schema.parse(data);
  }

  static from(tokenString: string): AuthToken | undefined {
    try {
      const solvedToken = jwt.verify(tokenString, AuthToken.SECRET);
      if (!solvedToken) return;

      const data = AuthToken.schema.parse(solvedToken);

      return new AuthToken(data);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  public serialize(expire?: number): string {
    return jwt.sign(this.data, AuthToken.SECRET, {
      expiresIn: expire || this.expireIn,
    });
  }
}
