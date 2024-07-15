import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./lib/env";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.listen(env.PORT, () => {
  console.log(`[server]: running on ${env.API_BASE_URL}:${env.PORT}`);
});
