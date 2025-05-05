import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 8000;

app.use(express.json());

app.use(
	cors({
		origin: "*",
	})
);

app.use("/", notesRoutes);

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
