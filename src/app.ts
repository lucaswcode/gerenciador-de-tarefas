import express from "express";

import { errorHandling } from "./middlewares/error-handling";

export const app = express();

app.use(express.json());

app.use(errorHandling);
