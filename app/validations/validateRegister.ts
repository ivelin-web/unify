import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required().min(3).messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
    }),
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
    confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
        "any.only": "Passwords does not match",
    }),
});

export default schema;
