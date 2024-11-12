import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET);

export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, secret);
    return false;
  } catch (err) {
    return true; 
  }
};
