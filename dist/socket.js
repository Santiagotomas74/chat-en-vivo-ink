"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = initializeSocket;
exports.getIO = getIO;
exports.isUserOnline = isUserOnline;
exports.getOnlineUsers = getOnlineUsers;
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
        /*
        =====================================
        Registrar usuario
        =====================================
        */
        socket.on("register", (userId) => {
            console.log("🟢 Usuario:", userId);
            onlineUsers.set(userId, socket.id);
            // ROOM PERSONAL
            socket.join(`user_${userId}`);
            io.emit("user_online", userId);
        });
        /*
        =====================================
        Entrar conversación
        =====================================
        */
        socket.on("join_conversation", (conversationId) => {
            console.log("JOIN", conversationId);
            socket.join(`conversation_${conversationId}`);
        });
        /*
        =====================================
        Salir conversación
        =====================================
        */
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`conversation_${conversationId}`);
        });
        /*
        =====================================
        Desconectar
        =====================================
        */
        socket.on("disconnect", () => {
            console.log("❌ Socket desconectado:", socket.id);
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("user_offline", userId);
                    break;
                }
            }
        });
    });
    return io;
}
function getIO() {
    return io;
}
function isUserOnline(userId) {
    return onlineUsers.has(userId);
}
function getOnlineUsers() {
    return [...onlineUsers.keys()];
}
