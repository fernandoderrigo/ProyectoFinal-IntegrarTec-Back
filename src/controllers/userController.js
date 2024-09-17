import { PrismaClient } from '@prisma/client';
import { encrypt, verified } from '../utils/bcrypt.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenManagment.js';
import { createUserSchema, idUserSchema, updateUserSchema } from '../schemas/userSchemas.js';
import HTTP_STATUS from '../helpers/httpstatus.js';
import { verifyToken } from '../utils/jwtUtils.js';
import  uploadImage  from '../utils/uploadImage.js';
import { deleteFile } from '../utils/s3.js'

const prisma = new PrismaClient();

const userController = () => {
  const createUser = async (req, res, next) => {
    uploadImage(req, res, async (err) => {
      if (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading file' });
      }
  
      const { error: validationError } = createUserSchema.validate(req.body);
      if (validationError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
      }
  
      const { email, password } = req.body;
  
      try {
        const existingUser = await prisma.users.findUnique({
          where: { email },
        });
  
        if (existingUser) {
          return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email is already in use' });
        }
  
        const hashedPassword = await encrypt(password);
  
        if (!req.file || !req.file.location) {
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'File upload failed or file location is undefined' });
        }
  
        try {
          const user = await prisma.users.create({
            data: {
              ...req.body,
              password: hashedPassword,
              state: '1',
              image_Url: req.file.location,
              created_At_dateTime: new Date(),
              updated_At_dateTime: null,
            },
          });
  
          return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: user,
          });
        } catch (error) {
          return next(error);
        }
      } catch (error) {
        return next(error);
      } finally {
        await prisma.$disconnect();
      }
    });
  };  

  const getUsers = async (_req, res, next) => {
    try {
      const users = await prisma.users.findMany();
      res.json(users);
    } catch (error) {
      next(error);
    }
    finally {
      await prisma.$disconnect();
    }
  };

  const getUserById = async (req, res, next) => {
    const { error } = idUserSchema.validate(req.params);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
    }
    try {
      const user = await prisma.users.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
    finally {
      await prisma.$disconnect();
    }
  };

  const updateUser = async (req, res, next) => {
    const { error: paramsError } = idUserSchema.validate(req.params);
    if (paramsError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: paramsError.details[0].message });
    }
    
    const { email, password, ...restBody } = req.body;
    const { error: bodyError } = updateUserSchema.validate(restBody);
    if (bodyError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: bodyError.details[0].message });
    }
    
    try {
      const userId = parseInt(req.params.id);
  
      if (req.user.id !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Access denied. You can only update your own information.' });
      }
  
      const userExist = await prisma.users.findUnique({
        where: { id: userId }
      });
  
      if (!userExist) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
  
      const userData = { ...restBody };
  
      if (req.file) {
        if (userExist.image_Url) {
          const deleteKey = userExist.image_Url.split('/').pop();
          await deleteFile(deleteKey);
        }
  
        userData.image_Url = req.file.location;
      }
  
      if (password) {
        userData.password = await encrypt(password);
      }
  
      if (email) {
        const existingUser = await prisma.users.findUnique({
          where: { email }
        });
  
        if (existingUser && existingUser.id !== userId) {
          return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email is already in use.' });
        }
        userData.email = email;
      }
  
      await prisma.users.update({
        where: { id: userId },
        data: userData
      });
  
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  };  

  const deleteUser = async (req, res, next) => {
    const { error } = idUserSchema.validate(req.params);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
    }
  
    try {
      const user = await prisma.users.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
      
      if (user.image_Url) {
        const deleteKey = user.image_Url.split('/').pop();
        await deleteFile(deleteKey);
      }
  
      await prisma.users.delete({
        where: { id: parseInt(req.params.id) }
      });
  
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  };  

  const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Email and password are required.' });
    }

    try {
      const user = await prisma.users.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found.' });
      }

      const isPasswordValid = await verified(password, user.password);

      if (!isPasswordValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Incorrect password.' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ accessToken, refreshToken, message: 'Successful login' });
    } catch (error) {
      next(error);
    }
    finally {
      await prisma.$disconnect();
    }
  };

  const refreshToken = async (req, res, next) => {
    const refreshToken = req.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Refresh token is required.' });
    }

    try {
      const decodedToken = verifyToken(refreshToken);

      if (decodedToken.error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid refresh token.' });
      }

      const user = await prisma.users.findUnique({
        where: { id: decodedToken.id }
      });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found.' });
      }

      const accessToken = generateAccessToken(user);

      res.json({ accessToken, message: 'Access token refreshed successfully.' });
    } catch (error) {
      next(error);
    }
  };

  return {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    refreshToken
  };
};

export default userController;