import express,  { json } from "express";
import mainRoutes from "./routes/mainRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import "./db/mongoose.js";
const app = express();
const port = process.env.port || 4000;

app.use(json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(mainRoutes);
app.use(adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
