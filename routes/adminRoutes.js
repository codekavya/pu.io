import { Router, urlencoded } from "express";
import auth from "../auth/auth.js";
import User from "../models/adminModels.js";
import bcrypt from "bcryptjs";
import path from "path";
import PwdResetModel from "../models/passwordResetModel.js";
import resetPasswordHandler, {
  deleteUser,
  updateUser,
  postLogoutUsers,
  postUserSignIn,
  postLogoutAllSession,
  postUserSignUp,
  postreqForm,
  getApiKeyOrForm,
  resetPassword,
} from "../controllers/adminController.js";
import formHandler from "../auth/apiFormHandler.js";
import { AUTH_TYPE } from "../Utils/constants.js";

const router = Router();

router.use(
  urlencoded({
    extended: false,
  })
);

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

router.get("/key", auth(AUTH_TYPE.TOKEN), getApiKeyOrForm);

router.post("/key", auth(AUTH_TYPE.TOKEN), formHandler);

router.post("/signin", postUserSignIn);

router.get("/user/me", auth(AUTH_TYPE.TOKEN), async (req, res) => {
  res.send(req.user);
});

router.post("user/logout", auth(AUTH_TYPE.TOKEN), postLogoutUsers);
router.post("user/logout/all", auth(AUTH_TYPE.TOKEN), postLogoutAllSession);

router.delete("/users/:id", auth(AUTH_TYPE.TOKEN), deleteUser);
router.patch("/users/:id", auth(AUTH_TYPE.TOKEN), updateUser);
router.post("/reqreset", resetPassword);

router.post("/passwordReset/:id", resetPasswordHandler);
router.get("/passwordReset/:id", resetPasswordHandler);
export default router;
