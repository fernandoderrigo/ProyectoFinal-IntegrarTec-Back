import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; 
const ACCESS_TOKEN_EXPIRATION = '4m'; 
const REFRESH_TOKEN_EXPIRATION = '1d';

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, state: user.state },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRATION }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, state: user.state },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRATION }
  );
};

export { generateAccessToken, generateRefreshToken };