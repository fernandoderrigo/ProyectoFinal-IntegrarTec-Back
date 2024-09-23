import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpstatus.js";
import { idUserSchema } from "../schemas/preferenceSchema.js";

const prisma = new PrismaClient();

const preferenceController = () => {
    const getPreferenceByIdUser = async (req, res, next) => {
        const { error } = idUserSchema.validate(req.params);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.details[0].message });
        }
    
        const userId = parseInt(req.params.id, 10);
    
        try {
            const preference = await prisma.preferences.findUnique({
                where: { id_user: userId },
                include: {
                    songs: true,
                    users: true,
                },
            });
    
            if (!preference) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Preference not found" });
            }
    
            const genresFav = preference.genders_fav;
    
            const songsByGenres = await prisma.songs.findMany({
                where: {
                    gender: { in: genresFav }, 
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
    
            const artistIds = preference.artists_fav; 
            const songsByArtists = await prisma.songs.findMany({
                where: {
                    artists_on_songs: {
                        some: {
                            artists: {
                                name: { in: artistIds }, 
                            },
                        },
                    },
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
    
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                userId: userId,
                preference: preference,
                songsByGenres,
                songsByArtists,
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };              

    return {
        getPreferenceByIdUser,
    };
};

export default preferenceController;
