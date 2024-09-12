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

    const getSong = () => { };

    const getSongByName = () => { };

    const updateSong = () => { };

    const deleteSong = () => { };

    return {
        createSong,
        getSong,
        getSongByName,
        updateSong,
        deleteSong
    }
} 