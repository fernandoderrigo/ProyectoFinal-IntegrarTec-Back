import HTTP_STATUS from '../helpers/httpstatus.js';
import { verifyToken, extractToken } from '../utils/jwtUtils.js';

const verifyMiddleware = async (req, res, next) => {
  const token = extractToken(req.headers);
  
  if (!token) {

    if ((req.method === 'GET' && req.path === '/users') || (req.method === 'POST' && req.path === '/users')) {
      return next();
    }

    console.error("Error verifying token: TokenNotProvidedError: Token not provided");
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Token not provided' });
  }

  try {
    const decodedToken = verifyToken(token);

    if (decodedToken.error) {
      if (decodedToken.error === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Expired token' });
      } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid Token' });
      }
    }
    
    if (decodedToken.state !== '1') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Account is disabled' });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Error decoding token:', err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Authentication Error' });
  }
};

export default verifyMiddleware;
