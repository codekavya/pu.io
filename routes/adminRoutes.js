import { Router, urlencoded } from "express";
import auth from "../auth/auth.js";
import {
  deleteUser,
  updateUser,
  postLogoutUsers,
  postUserSignIn,
  postLogoutAllSession,
  postUserSignUp,
  postreqForm,
  getAPIKEY,
} from "../controllers/adminController.js";
import formHandler from "../auth/apiFormHandler.js";

const router = Router();

router.use(urlencoded({ extended: false }));

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

router.post("/signup", postUserSignUp);

router.get("/key", auth, getAPIKEY);

router.post("/key", auth, formHandler);

router.post("/signin", postUserSignIn);

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("user/logout", auth, postLogoutUsers);
router.post("user/logout/all", auth, postLogoutAllSession);

router.delete("/users/:id", auth, deleteUser);
router.patch("/users/:id", auth, updateUser);

export default router;
