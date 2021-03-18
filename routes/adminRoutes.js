import { Router, urlencoded } from "express";
import auth from "../auth/auth.js";
import { postUserSignUp } from "../controllers/adminController.js";
import { deleteUser } from "../controllers/adminController.js";
import { updateUser } from "../controllers/adminController.js";
import { postLogoutUsers } from "../controllers/adminController.js";
import { postUserSignIn } from "../controllers/adminController.js";
import { postLogoutAllSession } from "../controllers/adminController.js";
import { postreqForm } from "../controllers/adminController.js";
import { getAPIKEY } from "../controllers/adminController.js";
import generate from "../auth/generateKey.js";

import { limitForAccount as limiter } from "../controllers/adminController.js";

const router = Router();

const parser = urlencoded({ extended: false });

router.use(limiter, parser);

//Frontend endpoints only for Development
router.get("/login", (req, res) => {
  res.send(
    '<form action="/signin" method="POST"><input type="email" name="Email" id="Email"><input type="password" name="Password" id="pwd"><button type="submit">Send</button></form>'
  );
});
router.get("/form", (req, res, next) => {
  res.send(
    '<form action="/signup" method="POST">Name:<input type="text" name="Name"><br>Age:<input type="number" name="Age"><br>Email:<input type="Email" name="Email"><br>Password:<input type="password" name="Password"><button type="submit">Send</button></form>'
  );
});
router.get("/rkey", (req, res, next) => {
  res.send(
    '<form action="/key" method="POST">Name:<input type="text" name="Name"><br>Password:<input type="password" name="Password"><br>Email:<input type="Email" name="Email"><br>Faculty:<input type="text" name="Faculty"><br>College:<input type="text" name="College"><br>Purpose:<textarea name="Purpose"></textarea><br><button type="submit">Send</button></form>'
  );
});

router.post("/signup", postUserSignUp);
router.post("/key", auth, postreqForm);
router.post("/signin", postUserSignIn);

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("user/logout", auth, postLogoutUsers);
router.post("user/logout/all", auth, postLogoutAllSession);

router.delete("/users/:id", auth, deleteUser);
router.patch("/users/:id", auth, updateUser);

export default router;
