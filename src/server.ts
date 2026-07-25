import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { createServer } from "http";

import emitRoutes from "./routes/emit";
import { initializeSocket } from "./socket";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Chat Server Online",
  });
});

app.use("/", emitRoutes);

const httpServer = createServer(app);

initializeSocket(httpServer);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Chat Server escuchando en ${PORT}`);
});
