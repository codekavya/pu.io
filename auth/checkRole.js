const authenticateRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ Error: "Unable to Authorize" });
  }
  if (req.user.roles.some((role) => role === "role.superAdmin")) {
    req.roles = req.user.roles;
    return next();
  }
  const authorized = req.user.roles.some((userrole) =>
    roles.some((role) => userrole === role)
  );
  if (authorized) {
    req.roles = req.user.roles;
    return next();
  }
  return res.status(401).json({
    Error: "Unauthorized for your role",
  });
};
export default authenticateRole;
