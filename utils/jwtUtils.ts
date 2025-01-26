import jwt from 'jsonwebtoken';

export async function verifyJWT(token: string) {
  try {
    // Verify the token using the secret
    const payload = jwt.verify(token, process.env.SECRET!);
    return payload; // The decoded payload
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null; 
  }
}
