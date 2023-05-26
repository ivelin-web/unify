import Joi from "joi";

const schema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Email is invalid",
        }),
    password: Joi.string().required().min(6).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 symbols",
    }),
});

export default schema;
