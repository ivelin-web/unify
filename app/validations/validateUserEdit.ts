import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required().min(3).messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
    }),
    image: Joi.string().allow(null).optional(),
});

export default schema;
