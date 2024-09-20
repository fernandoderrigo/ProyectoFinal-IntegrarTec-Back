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
            const preference = await prisma.Preferences.findUnique({
                where: { id_user: userId },
                include: {
                    favorite_songs: true,
                    user: true,
                },
            });
    
            if (!preference) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Preference not found" });
            }
    
            const genresFav = preference.genders_fav;
    
            const songsByGenres = await prisma.Songs.findMany({
                where: {
                    gender: { in: genresFav }, 
                },
                include: {
                    artists: {
                        include: {
                            artist: true,
                        },
                    },
                    album: true,
                },
            });
    
            const artistIds = preference.artists_fav; 
            const songsByArtists = await prisma.Songs.findMany({
                where: {
                    artists: {
                        some: {
                            artist: {
                                name: { in: artistIds }, 
                            },
                        },
                    },
                },
                include: {
                    artists: {
                        include: {
                            artist: true,
                        },
                    },
                    album: true,
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
