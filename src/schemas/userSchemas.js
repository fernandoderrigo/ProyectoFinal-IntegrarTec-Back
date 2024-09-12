import Joi from 'joi';

export const createUserSchema = Joi.object({
    first_Name: Joi.string().required(),
    last_Name: Joi.string().required(),
    nick_Name: Joi.string().required(),
    birthDay_date: Joi.date().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    state: Joi.string().valid('0', '1').default('1'),
});


export const idUserSchema = Joi.object({
    id: Joi.number().integer().positive(),
})

export const updateUserSchema = Joi.object({
    first_Name: Joi.string().optional(),
    last_Name: Joi.string().optional(),
    nick_Name: Joi.string().optional(),
    birthday_Date: Joi.date().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).max(20).optional(),
    state: Joi.string().valid('0', '1').optional()
});
