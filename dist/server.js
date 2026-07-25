"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const emit_1 = __importDefault(require("./routes/emit"));
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Chat Server Online",
    });
});
app.use("/", emit_1.default);
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.initializeSocket)(httpServer);
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Chat Server escuchando en ${PORT}`);
});
