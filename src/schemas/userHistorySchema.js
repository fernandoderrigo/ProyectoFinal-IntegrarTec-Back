import Joi from 'joi';

export const createUserHistorySchema = Joi.object({
    id_user: Joi.number().integer().required(),
    id_song: Joi.number().integer().required(),
    date : Joi.date().iso().required(),
});