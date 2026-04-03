import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { makeRouter } from "./infra/factories/makeRouter";
import { requestLogger } from "./interfaces/http/middlewares/requestLogger";
import { openApiSpec } from "./interfaces/http/docs/openapi";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler";
import { Logger } from "./shared/logging/Logger";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(express.json());
app.use(requestLogger);
app.get("/docs.json", (_req, res) => {
    res.json(openApiSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use(makeRouter());
app.use(errorHandler);

app.listen(PORT, () => {
    Logger.info("Server started", { port: PORT });
});

export { app };