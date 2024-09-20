import Joi from 'joi';

export const createAlbumSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    release_Date: Joi.date().iso().required(),
    image_Url: Joi.string().optional()
});

export const updateAlbumSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    release_Date: Joi.date().iso().optional(),
    image_Url: Joi.string().optional()
});