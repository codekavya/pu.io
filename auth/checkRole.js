const authenticateRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ Error: "Unable to Authorize" });
  }
  console.log(req.user.roles);
  if (req.user.roles.some((role) => role.role === "role.superAdmin")) {
    return next();
  }
  const authorized = req.user.roles.some((userrole) =>
    roles.some((role) => userrole.role === role)
  );
  if (authorized) {
    return next();
  }
  return res.status(401).json({
    Error: "Unauthorized",
  });
};
export default authenticateRole;
