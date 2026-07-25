import { Router } from "express";
import { getIO } from "../socket";

const router = Router();

/*
==========================================
Nuevo mensaje
==========================================
*/

router.post("/emit-message", (req, res) => {
  console.log("Emitir mensaje:", req.body);

  const { conversationId, message } = req.body;
  console.log("EMIT", conversationId, new Date().toISOString());

  getIO().to(`conversation_${conversationId}`).emit("new_message", message);

  return res.json({
    success: true,
  });
});

/*
==========================================
Typing
==========================================
*/

router.post("/emit-typing", (req, res) => {
  console.log("Emitir typing:", req.body);
  const { conversationId, userId } = req.body;

  getIO().to(`conversation_${conversationId}`).emit("typing", userId);

  return res.json({
    success: true,
  });
});

/*
==========================================
Stop typing
==========================================
*/

router.post("/emit-stop-typing", (req, res) => {
  console.log("Emitir stop typing:", req.body);
  const { conversationId, userId } = req.body;

  getIO().to(`conversation_${conversationId}`).emit("stop_typing", userId);

  return res.json({
    success: true,
  });
});

/*
==========================================
Mensajes leídos
==========================================
*/

router.post("/emit-read", (req, res) => {
  console.log("Emitir mensajes leídos:", req.body);
  const { conversationId, userId } = req.body;

  getIO().to(`conversation_${conversationId}`).emit("messages_read", userId);

  return res.json({
    success: true,
  });
});

export default router;
