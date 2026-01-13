export const isAuthenticated = (req, res, next) => {
  if (!req.session.employee) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.session.employee.emp_role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
