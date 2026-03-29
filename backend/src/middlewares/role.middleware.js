export const isMainAdmin = (req, res, next) => {
  if (req.user.role !== "MAIN_ADMIN") {
    return res.status(403).json({
      message: "Access denied. Main Admin only."
    });
  }
  next();
};

export const isLocalAdmin = (req, res, next) => {
  if (req.user.role !== "LOCAL_ADMIN") {
    return res.status(403).json({
      message: "Access denied. Local Admin only."
    });
  }
  next();
};