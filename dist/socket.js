"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
let io;
const onlineUsers = new Map();
function initializeSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("✅ Cliente conectado:", socket.id);
        console.log("✅ Socket conectado:", socket.id);
        /*
        ======================================
        Registrar usuario
        ======================================
        */
        socket.on("register", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("Usuario:", userId);
            io.emit("user_online", userId);
        });
        /*
        ======================================
        Entrar conversación
        ======================================
        */
        socket.on("join_conversation", (conversationId) => {
            socket.join(`conversation_${conversationId}`);
            console.log("Entró:", conversationId);
        });
        /*
        ======================================
        Salir conversación
        ======================================
        */
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`conversation_${conversationId}`);
        });
        /*
        ======================================
        Desconectar
        ======================================
        */
        socket.on("join_conversation", (conversationId) => {
            console.log("JOIN", socket.id, conversationId, new Date().toISOString());
            socket.join(`conversation_${conversationId}`);
        });
        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("user_offline", userId);
                    break;
                }
            }
            console.log("Socket desconectado");
        });
    });
    return io;
}
function getIO() {
    return io;
}
