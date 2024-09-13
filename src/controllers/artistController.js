import { PrismaClient } from "@prisma/client";
import { createArtistSchema } from '../schemas/artistSchema.js';
import HTTP_STATUS from '../helpers/httpstatus.js'; 

const prisma = new PrismaClient();

const artistController = () => {
    const createArtist = async (req, res, next) => {
        const { error: validationError } = createArtistSchema.validate(req.body);
        if (validationError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
        }

        try {
            const existingArtist = await prisma.artists.findUnique({
                where: { name: req.body.name }
            });

            if (existingArtist) {
                return res.status(HTTP_STATUS.CONFLICT).json({
                    success: false,
                    message: 'Artist already exists with the same name'
                });
            }

            const artist = await prisma.artists.create({
                data: {
                    name: req.body.name
                }
            });

            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Artist created successfully',
                data: artist
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getAllArtists = async (req, res, next) => {
        try {
            const artists = await prisma.artists.findMany();
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: artists
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    return {
        createArtist,
        getAllArtists
    }
}

export default artistController;
