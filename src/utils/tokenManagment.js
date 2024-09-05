import jwt from 'jsonwebtoken'

export const generateToken = ({ data, expiresIn = '1h', isRefresh = false }) => {
    const secretKey = isRefresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET 
    const token = jwt.sign(data, secretKey, {
      expiresIn
    })
  
    return token
  }
  
  export const verifyToken = (token, isRefresh = false) => {
    const secretKey = isRefresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET ;
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}