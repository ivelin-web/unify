import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
    }),
    members: Joi.array()
        .min(2)
        .items(
            Joi.object({
                label: Joi.string().required(),
                value: Joi.string().required(),
            })
        )
        .messages({
            "array.min": "You must add at least 2 members",
            "array.includes": "You must add at least 2 members",
        }),
});

export default schema;
