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

        req.body.id_usuario = parseInt(req.body.id_usuario, 10);
        const { error: validationError } = createPlaylistSchema.validate(req.body);
        if (validationError) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
        }
        try {
            if (req.body.id_usuario) {
                const userExists = await prisma.users.findUnique({
                    where: { id: req.body.id_usuario },
                });
                if (!userExists) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "User not found" });
                }
            }
            const playlist = await prisma.playlists.create({
                data: {
                    name: req.body.name,
                    id_usuario: req.body.id_usuario,
                    created_At_Datetime: new Date(),
                    updated_At_Datetime: null,
                    user: req.body.id_usuario ? { connect: { id: req.body.id_usuario } } : undefined,
                    songsInPlaylists: {
                        create: req.body.songs.map(songId => ({
                            songs: { connect: { id: songId } }
                        }))
                    }
                },
                include: {
                    user: true,
                    songsInPlaylists: {
                        include: {
                            songs: true
                        }
                    }
                }
            });
            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Playlist created successfully',
                data: playlist,
            });
        }
        catch (error) {
            next(error);
        }
        finally {
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
                    user: true,
                    songsInPlaylists: {
                        include: {
                            songs: true
                        }
                    }
                }
            });
            if (!playlist) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Playlist not found" });
            }

            const updatedData = {
                ...playlist,
                ...req.body,
                updated_At_Datetime: new Date()
            };

            const updatedPlaylist = await prisma.playlists.update({
                where: { id: playlistId },
                data: {
                    name: updatedData.name || playlist.name,
                    id_usuario: updatedData.id_usuario || playlist.id_usuario,
                    user: updatedData.id_usuario ? { connect: { id: updatedData.id_usuario } } : undefined,
                    songsInPlaylists: {
                        deleteMany: {},
                        create: req.body.songs.map(songId => ({
                            songs: { connect: { id: songId } }
                        }))
                    }
                },
                include: {
                    user: true,
                    songsInPlaylists: {
                        include: {
                            songs: true
                        }
                    }
                }
            });
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Playlist updated successfully',
                data: updatedPlaylist,
            });
        } catch (error) {
            next(error)
        } finally {
            await prisma.$disconnect();
        }

    };

    const getPlaylists = async (req, res, next) => {
        try {
            const playlists = await prisma.playlists.findMany({
                include: {
                    user: true
                },
                songsInPlaylists: {
                    songs: true
                }
            });
            res.json(playlists);
        } catch (error) {
            next(error)
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
                    user: true
                },
                songsInPlaylists: {
                    songs: true
                }
            });
            if (!playlists || playlists.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Playlist not found' });
            }
            res.json(playlists);
        }
        catch (error) {
            next(error);
        }
        finally {
            await prisma.$disconnect();
        }
    };

    const deletePlaylist = async (req, res, next) => {
        const { playlistId } = req.params;

        try {
            const playlist = await prisma.playlists.findUnique({
                where: { id: playlistId },
            });
            if (!playlist) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Playlist not found" });
            }
            await prisma.playlists.delete({
                where: { id: playlistId },
            })
        }
        catch (error) {
            next(error);
        }
        finally {
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