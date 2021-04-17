import express, { json } from "express";
import mainRoutes from "./routes/mainRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import path, { dirname } from "path";
import "./db/mongoose.js";
import * as http from "http";
import * as socketio from "socket.io";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

const port = process.env.port || 4000;
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(mainRoutes);
app.use(adminRoutes);
app.use(chatRoutes);

app.use((req, res) => {
  console.log(req.originalUrl);
  return res.status(404).send({ Error: "Page not found" });
});

const server = http.createServer(app);
export const io = new socketio.Server();
io.attach(server);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  return res.status(status).json({ message: message });
});
server.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
