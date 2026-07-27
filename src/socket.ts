import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

const onlineUsers = new Map<string, string>();

export function initializeSocket(server: HttpServer) {
  io = new Server(server, {
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

    socket.on("register", (userId: string) => {
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

    socket.on("join_conversation", (conversationId: string) => {
      console.log("JOIN", conversationId);

      socket.join(`conversation_${conversationId}`);
    });

    /*
    =====================================
    Salir conversación
    =====================================
    */

    socket.on("leave_conversation", (conversationId: string) => {
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

export function getIO() {
  return io;
}

export function isUserOnline(userId: string) {
  return onlineUsers.has(userId);
}

export function getOnlineUsers() {
  return [...onlineUsers.keys()];
}
