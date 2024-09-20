import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return { error: 'TokenExpiredError' };
    }
    return { error: 'TokenVerificationError' };
  }
};

const extractToken = (headers) => {
  const token = headers.authorization?.split(' ')[1];
  return token;
};

export { verifyToken, extractToken };



