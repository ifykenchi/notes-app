import Joi from "joi";
import type {
	IResponse,
	ILogin,
	IAddNote,
} from "../interfaces/middleware.interfaces";

export const createSchema = (reply: IResponse) => {
	const schema = Joi.object({
		fullName: Joi.string().min(3).max(30).required(),

		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.required(),

		password: Joi.string().min(3).max(30).required(),
	});

	return schema.validate(reply);
};

export const loginSchema = (reply: ILogin) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net"] },
			})
			.required(),

		password: Joi.string().min(3).max(30).required(),
	});

	return schema.validate(reply);
};

export const addNoteSchema = (reply: IAddNote) => {
	const schema = Joi.object({
		title: Joi.string().max(30).required(),
		content: Joi.string().max(200).required(),
		tags: Joi.array().items(Joi.string()),
	});

	return schema.validate(reply);
};
