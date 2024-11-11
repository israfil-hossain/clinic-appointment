import { jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET);

export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const { payload } = await jwtVerify(token, secret);
    const tokenExpiration = new Date((payload as JWTPayload)?.exp! * 1000);
    return tokenExpiration <= new Date();
  } catch {
    return true;
  }
};
