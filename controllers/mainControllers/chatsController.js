import express from "express";
const { Router } = express;
import { io } from "../../app.js";
const router = Router();
import path from "path";
const __dirname = path.resolve();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/chatbox.html");
  io.once("connection", (socket) => {
    console.log("a connection created");
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      io.emit("chat message", msg);
    });
  });
});

export default router;
