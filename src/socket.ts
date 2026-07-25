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
    console.log("✅ Socket conectado:", socket.id);

    /*
    ======================================
    Registrar usuario
    ======================================
    */

    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);

      console.log("Usuario:", userId);

      io.emit("user_online", userId);
    });

    /*
    ======================================
    Entrar conversación
    ======================================
    */

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation_${conversationId}`);

      console.log("Entró:", conversationId);
    });

    /*
    ======================================
    Salir conversación
    ======================================
    */

    socket.on("leave_conversation", (conversationId: string) => {
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

export function getIO() {
  return io;
}
