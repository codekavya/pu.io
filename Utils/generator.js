import crypto from "crypto";
import bcrypt from "bcryptjs";
export const generateToken = async (user) => {
  //Generate New Token id;
  let resetToken = crypto.randomBytes(32).toString("hex");
  const Document = {
    userId: user._id,
    token: resetToken,
    createdAt: Date.now(),
  };
  return Document;
};

export const generateLink = async (clientURL, specificRoute, resetToken) => {
  const link = `${clientURL}/${specificRoute}/${resetToken}`;
  return link;
};
