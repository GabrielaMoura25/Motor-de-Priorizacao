import express from "express";
import router from "./interfaces/http/routes";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});