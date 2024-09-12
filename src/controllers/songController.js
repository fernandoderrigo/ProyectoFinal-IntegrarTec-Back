import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpstatus";
import { upload } from "../utils/s3";
import { deleteFile } from "../utils/s3";

const prisma = new PrismaClient();

export const songController = () => {
    const createSong = async (req, res, next) => {
        //Validacion de datos recibidos
        const { error: validationError } = createSongSchema.validate(req.body);
        if (validationError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
        }
        try {
            //Subida de imagen a S3
            upload(req, res, async (error) => {
                if (error) {
                    next(error)
                }
                try {
                    //Creacion de cancion
                    const song = await prisma.songs.create({
                        data: {
                            ...req.body,
                            image_Url: req.file.location,
                            created_dateTime: new Date(),
                            updated_dateTime: null
                        }
                    })
                    return res.status(HTTP_STATUS.CREATED).json({
                        success: true,
                        message: 'Song created successfully',
                        data: song
                    })
                } catch (error) {
                    next(error)
                }
            })
        } catch (error) {
            next(error)
        } finally {
            await prisma.$disconnect();
        }
    };

    const getSongs = async (_req, res, next) => {
        try {
            const songs = await prisma.songs.findMany();
            res.json(songs);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getSongByName = async (req, res, next) => {
        const { error } = nameSongSchema.validate(req.params);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
        try {
            const song = await prisma.songs.findMany({
                where: { name: parseInt(req.params.id) }
            });
            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Song not found' });
            }
            res.json(song);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const updateSong = async (req, res, next) => {
        const { error: paramsError } = idSongSchema.validate(req.params);
        if (paramsError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: paramsError.details[0].message });
        }
        const { error: bodyError } = updateSongSchema.validate(req.body);
        if (bodyError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: bodyError.details[0].message });
        }
        try {
            const song = await prisma.songs.findUnique({
                where: { id: parseInt(req.params.id) }
            });
            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Song not found' });
            }
            if (req.file) {
                const deleteKey = song.image_Url.split('/').pop();
                await deleteFile(deleteKey);
                songData.image_Url = req.file.location
            }
            const songData = { ...req.body };
            await prisma.songs.update({
                where: { id: parseInt(req.params.id) },
                data: songData
            });
            res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const deleteSong = async (req, res, next) => {
        const { error } = idSongSchema.validate(req.params);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
        try {
            const song = await prisma.songs.findUnique({
                where: { id: parseInt(req.params.id) }
            });
            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Song not found' });
            }
            await prisma.songs.delete({
                where: { id: parseInt(req.params.id) }
            });
            const deleteKey = song.image_Url.split('/').pop();
            await deleteFile(deleteKey);

            res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error) {
            next(error);
        }
        finally {
            await prisma.$disconnect()
        }
    };

    return {
        createSong,
        getSongs,
        getSongByName,
        updateSong,
        deleteSong
    }
} 