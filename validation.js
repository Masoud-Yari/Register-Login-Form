const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        email: Joi.string()
            .email({minDomainSegments: 2, tlds: { allow: ['com', 'ir']}})
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .email({minDomainSegments: 2, tlds: { allow: ['com', 'ir']}})
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;