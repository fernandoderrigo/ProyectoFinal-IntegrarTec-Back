import Joi from 'joi';

export const createSongSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    duration: Joi.number().required(),
    gender: Joi.string().valid('Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical','Reggaeton').required(),
    release_Date: Joi.date().iso().required(),
    image_Url: Joi.string().optional(),
    audio_Url: Joi.string(),
    albumId: Joi.number().integer().optional(), 
    artistIds: Joi.string()
        .pattern(/^\d+(,\d+)*$/) 
        .required()
        .messages({
            'string.base': 'Artist IDs must be a string',
            'string.pattern.base': 'Artist IDs must be a comma-separated list of numbers',
            'string.empty': 'Artist IDs are required',
            'any.required': 'Artist IDs are required'
        })
});

export const updateSongSchema = Joi.object({
    name: Joi.string().optional(),
    artistId: Joi.number().optional().allow(null),  
    albumId: Joi.number().optional().allow(null),   
    duration: Joi.number().optional(),
    gender: Joi.string().optional(),
    image_Ur: Joi.string().optional(),
    audio_Url: Joi.string().optional(),  
    release_Date: Joi.date().iso().optional(),
    state: Joi.string().valid('0', '1').optional(),
});

export const nameSongSchema = Joi.object({
    name: Joi.string().required(),
});

export const idSongSchema = Joi.object({
    id: Joi.number().required(),
});
