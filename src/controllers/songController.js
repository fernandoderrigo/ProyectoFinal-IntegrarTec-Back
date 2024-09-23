import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpstatus.js";
import { deleteFile } from "../utils/s3.js"
import { createSongSchema, idSongSchema, nameSongSchema, updateSongSchema } from "../schemas/songSchema.js";
import uploadImage from "../utils/uploadImage.js";

const prisma = new PrismaClient();

const songController = () => {
    const createSong = async (req, res, next) => {
        uploadImage(req, res, async (err) => {
            if (err) {

                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading file: ' + err.message });
            }

            req.body.albumId = parseInt(req.body.albumId, 10);

            const { error: validationError } = createSongSchema.validate(req.body);
            if (validationError) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
            }

            try {
                if (!req.file || !req.file.location) {
                    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'File upload failed or file location is undefined' });
                }

                const artistIds = req.body.artistIds.split(',').map(id => parseInt(id.trim(), 10));

                if (req.body.albumId) {
                    const albumExists = await prisma.albums.findUnique({
                        where: { id: req.body.albumId },
                    });
                    if (!albumExists) {
                        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Album not found" });
                    }
                }

                const artists = await prisma.artists.findMany({
                    where: { id: { in: artistIds } },
                });
                if (artists.length !== artistIds.length) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "One or more artists not found" });
                }

                const song = await prisma.songs.create({
                    data: {
                        name: req.body.name,
                        duration: req.body.duration,
                        gender: req.body.gender,
                        release_Date: new Date(req.body.release_Date),
                        image_Url: req.file.location,
                        audio_Url: req.body.audio_Url,
                        created_At_Datetime: new Date(),
                        updated_At_Datetime: null,
                        album: req.body.albumId ? { connect: { id: req.body.albumId } } : undefined,
                        artists: {
                            create: artistIds.map(artistId => ({
                                artist: { connect: { id: artistId } }
                            })),
                        },
                    },
                    include: {
                        artists: {
                            include: {
                                artist: true
                            }
                        },
                        album: true,
                    },
                });

                return res.status(HTTP_STATUS.CREATED).json({
                    success: true,
                    message: 'Song created successfully',
                    data: song,
                });
            } catch (error) {
                try {
                    if (req.file && req.file.location) {
                        const imageKey = req.file.location.split('/').pop();
                        await deleteFile(imageKey);
                    }
                } catch (deleteError) {
                    next(deleteError)
                }
                next(error);
            } finally {
                await prisma.$disconnect();
            }
        });
    };

    const getSongs = async (_req, res, next) => {
        try {
            const songs = await prisma.songs.findMany({
                include: {
                    artists_on_songs: {
                        include: {
                            artists: true,
                        },
                    },
                    albums: true,
                },
            });
            res.json(songs);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getSongById = async (req, res, next) => {
        const { error } = idSongSchema.validate(req.params);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }

        try {
            const song = await prisma.songs.findUnique({
                where: { id: parseInt(req.params.id) },
                include: {
                    artists_on_songs: {
                        include: {
                            artists: true,
                        },
                    },
                    albums: true,
                }
            });

            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Song not found' });
            }

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: song,
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getSongByName = async (req, res, next) => {
        const { name } = req.params; 
        const { error } = nameSongSchema.validate({ name });
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
    
        try {
            const songs = await prisma.songs.findMany({
                where: {
                    name: {
                        contains: name,   
                        mode: 'insensitive', 
                    }
                },
                include: {
                    artists_on_songs: {
                        include: {
                            artists: true,
                        },
                    },
                    albums: true,
                },
            });
    
            if (!songs || songs.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'No songs found' });
            }
    
            res.json(songs);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };    

    const updateSong = async (req, res, next) => {
        const { error: validationError } = updateSongSchema.validate(req.body);
        if (validationError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
        }

        const songId = parseInt(req.params.id, 10);

        try {
            const song = await prisma.songs.findUnique({
                where: { id: songId },
                include: { artists: true, album: true }
            });
            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Song not found" });
            }

            const updatedData = {
                ...song,
                ...req.body,
                updated_At_Datetime: new Date()
            };

            const artistIds = req.body.artistIds ? req.body.artistIds.split(',').map(id => parseInt(id.trim(), 10)) : [];
            if (artistIds.length > 0) {
                const artists = await prisma.artists.findMany({
                    where: { id: { in: artistIds } },
                });
                if (artists.length !== artistIds.length) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "One or more artists not found" });
                }
            }

            await prisma.songs.update({
                where: { id: songId },
                data: {
                    name: updatedData.name || song.name,
                    duration: updatedData.duration || song.duration,
                    gender: updatedData.gender || song.gender,
                    release_Date: updatedData.release_Date ? new Date(updatedData.release_Date) : song.release_Date,
                    image_Url: updatedData.image_Url || song.image_Url,
                    albumId: updatedData.albumId || song.albumId,
                    artists: {
                        deleteMany: {},
                        create: artistIds.map(artistId => ({ artist: { connect: { id: artistId } } })),
                    },
                },
                include: {
                    artists: {
                        include: {
                            artist: true,
                        },
                    },
                    album: true,
                }
            });

            return res.status(HTTP_STATUS.NO_CONTENT).json({
                success: true,
                message: 'Song updated successfully',
                data: updatedData
            });
        } catch (error) {
            return next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const deleteSong = async (req, res, next) => {
        const songId = parseInt(req.params.id, 10);

        try {
            const song = await prisma.songs.findUnique({ where: { id: songId } });
            if (!song) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Song not found" });
            }

            await prisma.history_user.deleteMany({
                where: { id_song: songId },
            });

            await prisma.artists_on_songs.deleteMany({
                where: { songId: songId },
            });

            if (song.image_Url) {
                const imageKey = song.image_Url.split('/').pop();
                await deleteFile(imageKey);
            }

            await prisma.songs.delete({ where: { id: songId } });

            return res.status(HTTP_STATUS.NO_CONTENT).json({
                success: true,
                message: 'Song delete successfully',
                data: song
            });
        } catch (error) {
            return next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    return {
        createSong,
        getSongs,
        getSongById,
        getSongByName,
        updateSong,
        deleteSong
    }
}

export default songController;