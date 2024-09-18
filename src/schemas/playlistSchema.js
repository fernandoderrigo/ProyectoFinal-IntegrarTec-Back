import Joi from 'joi';

export const createPlaylist = Joi.object({
    name: Joi.string().required(),
    id_usuario: Joi.number().integer().required()
});

export const updateSchema = Joi.object({
    name: Joi.string().required(),
    id_usuario: Joi.number().integer().required()
});

export const namePlaylistSchema = Joi.object({
    name: Joi.string().required(),
});

export const idPlaylistSchema = Joi.object({
    id: Joi.number().integer().required(),
});