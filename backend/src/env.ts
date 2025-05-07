import dotenv from "dotenv";
dotenv.config();

const env = {
	MONGO_URI: process.env.MONGO_URI,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
};

export default env;
