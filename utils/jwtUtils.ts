import { jwtVerify } from 'jose';

const secret = process.env.SECRET;

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
