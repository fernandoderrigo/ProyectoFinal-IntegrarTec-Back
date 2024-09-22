import { PrismaClient } from "@prisma/client";
import { createAlbumSchema, updateAlbumSchema } from '../schemas/albumSchema.js';
import HTTP_STATUS from '../helpers/httpstatus.js'; 
import uploadImage from '../utils/uploadImage.js';  
import { deleteFile } from '../utils/s3.js';  

const prisma = new PrismaClient();

const albumController = () => {
    const createAlbum = async (req, res, next) => {
        uploadImage(req, res, async (err) => {
            if (err) {
                console.error('Upload error:', err); 
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading file: ' + err.message });
            }
            
            const { error: validationError } = createAlbumSchema.validate(req.body);
            if (validationError) {
                console.error('Validation error:', validationError.details[0].message); 
          
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
            }
    
            try {
                if (!req.file || !req.file.location) {
                    console.error('File upload failed or file location is undefined'); 
             
                    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'File upload failed or file location is undefined' });
                }
    
                const existingAlbum = await prisma.albums.findFirst({
                    where: { name: req.body.name }
                });
    
                if (existingAlbum) {
                    console.error('Album with this name already exists'); 
              
                    return res.status(HTTP_STATUS.BAD_REQUEST).json({
                        error: 'An album with this name already exists'
                    });
                }
    
                const albumData = {
                    name: req.body.name,
                    release_Date: new Date(req.body.release_Date),
                    image_Url: req.file.location,
                    created_At_Datetime: new Date(),
                    updated_At_Datetime: null
                };
    
                const album = await prisma.albums.create({
                    data: albumData
                });
    
                return res.status(HTTP_STATUS.CREATED).json({
                    success: true,
                    message: 'Album created successfully',
                    data: album
                });
            } catch (error) {
                console.error('Error creating album:', error); 
                next(error);
            } finally {
                await prisma.$disconnect();
            }
        });
    };        

    const updateAlbum = async (req, res, next) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading file: ' + err.message });
            };

            const { id } = req.params;
            const { error: validationError } = updateAlbumSchema.validate(req.body);
            if (validationError) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: validationError.details[0].message });
            }

            try {
                const album = await prisma.albums.findUnique({ where: { id: parseInt(id) } });
                if (!album) {
                    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Album not found" });
                }
                
                let coverImage = album.image_Url;
                if (req.file && req.file.location) {
                    if (coverImage) {
                        const oldImageKey = coverImage.split('/').pop();
                        await deleteFile(oldImageKey);
                    }
                    coverImage = req.file.location;
                }

                const existingAlbum = await prisma.albums.findFirst({
                    where: {
                        name: req.body.name,
                        NOT: { id: parseInt(id) }
                    }
                });

                if (existingAlbum) {
                    return res.status(HTTP_STATUS.BAD_REQUEST).json({
                        error: 'An album with this name already exists'
                    });
                }

                await prisma.albums.update({
                    where: { id: parseInt(id) },
                    data: {
                        ...req.body,
                        image_Url: coverImage, 
                        updated_At_Datetime: new Date()
                    },
                });

                return res.status(HTTP_STATUS.NO_CONTENT).send();
            } catch (error) {
                next(error);
            } finally {
                await prisma.$disconnect();
            }
        });
    };

    const deleteAlbum = async (req, res, next) => {
        const { id } = req.params;

        try {
            const album = await prisma.albums.findUnique({ where: { id: parseInt(id) } });
            if (!album) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Album not found" });
            }

            if (album.image_Url) {
                const imageKey = album.image_Url.split('/').pop();
                await deleteFile(imageKey);
            }

            await prisma.albums.delete({ where: { id: parseInt(id) } });

            return res.status(HTTP_STATUS.NO_CONTENT).send();
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getAllAlbums = async (req, res, next) => {
        try {
            const albums = await prisma.albums.findMany({
                include: {
                    songs: true
                }
            });

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: albums
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    const getAlbumById = async (req, res, next) => {
        const { id } = req.params;

        try {
            const album = await prisma.albums.findUnique({
                where: { id: parseInt(id) },
                include: { songs: true } 
            });

            if (!album) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Album not found" });
            }

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: album
            });
        } catch (error) {
            next(error);
        } finally {
            await prisma.$disconnect();
        }
    };

    return {
        createAlbum,
        updateAlbum,
        deleteAlbum,
        getAllAlbums,
        getAlbumById
    }
}

export default albumController;


