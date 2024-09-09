import Joi from 'joi';

export const createUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    nickName: Joi.string().required(),
    birthDay_date: Joi.date().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    state: Joi.string().valid('0', '1').default('1'),
});

export const idUserSchema = Joi.object({
    id: Joi.number().integer().positive(),
})

export const updateUserSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    nickName: Joi.string().optional(),
    birthday_Date: Joi.date().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).max(20).optional(),
    state: Joi.string().valid('0', '1').optional()
});
