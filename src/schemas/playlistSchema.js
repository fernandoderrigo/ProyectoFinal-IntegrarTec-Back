import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
    name: Joi.string().required(),
    id_usuario: Joi.number().integer().required()
});

export const updatePlaylistSchema = Joi.object({
    name: Joi.string().required(),
    id_usuario: Joi.number().integer().required()
});

export const namePlaylistSchema = Joi.object({
    name: Joi.string().required(),
});
