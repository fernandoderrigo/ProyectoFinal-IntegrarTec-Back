import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpstatus.js';
import { createUserHistorySchema } from '../schemas/userHistorySchema.js';

const prisma = new PrismaClient();

const userHistoryController = () => {
  const createUserHistory = async (req, res) => {
    const { error } = createUserHistorySchema.validate(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details });
    }

    const { id_user, id_song } = req.body;

    try {
        const userExists = await prisma.users.findUnique({
            where: {
                id: id_user,
            },
        });

        if (!userExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
        }

        const songExists = await prisma.songs.findUnique({
            where: {
                id: id_song,
            },
        });

        if (!songExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Song not found' });
        }

        const userHistory = await prisma.history_User.create({
            data: {
            ...req.body,
            date: new Date() 
            },
        });

      res.status(HTTP_STATUS.CREATED).json(userHistory);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error creating user history', message: error.message });
    }
  };

  const getUserHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const userExists = await prisma.users.findUnique({
            where: {
                id: userId,
            },
        });

        if (!userExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
        }
        const userHistory = await prisma.history_User.findMany({
            where: {
            id_user: parseInt(userId),
            },
            orderBy: {
            date: 'desc',
            }
        });

      res.status(HTTP_STATUS.OK).json(userHistory);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching user history', message: error.message });
    }
  };

  const getAllUsersHistories = async (req, res) => {
    try {
      const usersHistories = await prisma.history_User.findMany({
        orderBy: {
          date: 'desc',
        },
        include: {
          user: true,
        },
      });

      res.status(HTTP_STATUS.OK).json(usersHistories);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching all users histories', message: error.message });
    }
  };

  return {
    createUserHistory,
    getUserHistory,
    getAllUsersHistories
  };
};

export default userHistoryController;