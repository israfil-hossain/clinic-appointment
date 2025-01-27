import jwt from 'jsonwebtoken';

export const isTokenExpired = async (token: string): Promise<boolean> => {
  const secret = process.env.SECRET;

  try {
    // Decode the token without verifying the signature to check the expiration
    const decoded = jwt.decode(token) as jwt.JwtPayload | null;

    if (!decoded) {
      throw new Error('Invalid token'); // Handle invalid token case
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // Check the "exp" claim
    if (decoded.exp && decoded.exp < currentTime) {
      return true; // Token is expired
    }

    // Verify the token to ensure its validity
    jwt.verify(token, secret as string);
    return false; // Token is valid and not expired
  } catch (err) {
    return true; // If verification fails, consider the token as expired
  }
};
