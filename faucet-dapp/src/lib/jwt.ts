import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET no configurado");

export type AuthPayload = {
  address: string;
};

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyAuthToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded as AuthPayload;
}
