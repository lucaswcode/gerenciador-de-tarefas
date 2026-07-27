import express from "express";

import { routes } from "@/routes/index";
import { errorHandling } from "./middlewares/error-handling";

export const app = express();

app.use(express.json());
app.use(routes);

app.use(errorHandling);
