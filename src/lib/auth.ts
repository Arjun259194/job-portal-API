import jwt from "jsonwebtoken";
import z from "zod";

export type AuthTokenPayload = z.infer<typeof Token.schema>;

export class Token {
    static readonly schema = z.object({
        id: z.string().uuid(),
        email: z.string().email(),
    });

    public data: AuthTokenPayload;

    constructor(data: any) {
        this.data = Token.schema.parse(data);
    }
}

export default class AuthToken {
    private readonly SECRET: string;
    constructor(secret: string) {
        if (!secret) throw new Error("No secret is passed");
        this.SECRET = secret;
    }

    deserialize(tokenString: string): Token | undefined {
        try {
            const solvedToken = jwt.verify(tokenString, this.SECRET);
            if (!solvedToken) return;

            return new Token(solvedToken);
        } catch (error) {
            console.error(error);
            return;
        }
    }

    public serialize(token: Token, exp: string | number = "3 days"): string {
        return jwt.sign(token.data, this.SECRET, {
            expiresIn: exp,
        });
    }
}
