import Joi from 'joi';

export const idUserSchema = Joi.object({
    id: Joi.number().required().messages({
        'number.base': 'ID must be a number',
        'any.required': 'ID is required'
    })
});
