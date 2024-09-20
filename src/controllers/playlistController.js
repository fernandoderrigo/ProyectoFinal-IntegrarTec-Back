import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpstatus.js';
import { createPlaylistSchema, updatePlaylistSchema, namePlaylistSchema } from '../schemas/playlistSchema.js';

const prisma = new PrismaClient();

const playlistController = () => {
    const createPlaylist = async (req, res, next) => {
        const { error } = createPlaylistSchema.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
    
        req.body.id_user = parseInt(req.body.id_user, 10);
    
        const { error: validationError } = createPlaylistSchema.validate(req.body);
        if (validationError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
        }
        
        try {
            if (req.body.id_user) {
                const userExists = await prisma.users.findUnique({
                    where: { id: req.body.id_user },
                });
                if (!userExists) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "User not found" });
                }
            }
            
            const songChecks = await Promise.all(req.body.songs.map(async (songId) => {
                return await prisma.songs.findUnique({ where: { id: songId } });
            }));

            const missingSongs = songChecks.filter(song => !song);
            if (missingSongs.length > 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "One or more songs not found" });
            }

            const playlist = await prisma.playlists.create({
                data: {
                    name: req.body.name,
                    created_At_Datetime: new Date(),
                    updated_At_Datetime: null,
                    users: req.body.id_user ? { connect: { id: req.body.id_user } } : undefined,
                    songs: {
                        create: req.body.songs.map(songId => ({
                            song: { connect: { id: songId } }
                        }))
                    }
                },
                include: {
                    users: true,
                    songs: {
                        include: {
                            song: true
                        }
                    }
                }
            });
    
            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Playlist created successfully',
                data: playlist,
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const updatePlaylist = async (req, res, next) => {
        const { error } = updatePlaylistSchema.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
    
        const playlistId = parseInt(req.params.id, 10);
    
        try {
            const playlist = await prisma.playlists.findUnique({
                where: { id: playlistId },
                include: {
                    users: true,
                    songs: {
                        include: {
                            songs: true
                        }
                    }
                }
            });
            if (!playlist) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Playlist not found" });
            }
            
            const songChecks = await Promise.all(req.body.songs.map(async (songId) => {
                return await prisma.songs.findUnique({ where: { id: songId } });
            }));
    
            const missingSongs = songChecks.filter(song => !song);
            if (missingSongs.length > 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "One or more songs not found" });
            }

            const updatedData = {
                ...playlist,
                ...req.body,
                updated_At_Datetime: new Date()
            };
    
            await prisma.playlists.update({
                where: { id: playlistId },
                data: {
                    name: updatedData.name || playlist.name,
                    id_user: updatedData.id_user || playlist.id_user,
                    user: updatedData.id_user ? { connect: { id: updatedData.id_user } } : undefined,
                    songs: { 
                        deleteMany: {}, 
                        create: req.body.songs.map(songId => ({
                            song: { connect: { id: songId } }
                        }))
                    }
                },
                include: {
                    user: true,
                    songs: { 
                        include: {
                            song: true
                        }
                    }
                }
            });
            return res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getPlaylists = async (req, res, next) => {
        try {
            const playlists = await prisma.playlists.findMany({
                include: {
                    users: true,
                    songs: { 
                        include: {
                            song: true
                        }
                    }
                }
            });
            res.json(playlists);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getPlaylistByName = async (req, res, next) => {
        const { error } = namePlaylistSchema.validate(req.params);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
        try {
            const playlists = await prisma.playlists.findMany({
                where: { name: req.params.name },
                include: {
                    users: true,
                    songs: { 
                        include: {
                            song: true
                        }
                    }
                }
            });
            if (!playlists || playlists.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Playlist not found' });
            }
            res.json(playlists);
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const deletePlaylist = async (req, res, next) => {
        const playlistId = parseInt(req.params.id, 10);
    
        try {
            const playlist = await prisma.playlists.findUnique({
                where: { id: playlistId },
            });

            if (!playlist) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Playlist not found" });
            }

            await prisma.Song_In_Playlist.deleteMany({
                where: { id_Playlist: playlistId },
            });

            await prisma.playlists.delete({
                where: { id: playlistId },
            });
            return res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    return {
        createPlaylist,
        updatePlaylist,
        getPlaylists,
        getPlaylistByName,
        deletePlaylist
    }
}

export default playlistController;