const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppEroor");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    res.status(401).json({ message: "Unauthorized !" });
  const token = authHeader.split(" ")[1];
  // verify the access token if is still not expired 
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) throw new AppError("forbidden" , 403);
    // add the userId and the Role for this user from the 
    req.user = decoded.userInfo;
    next();
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) throw new AppError("Access denied !" , 403)
    next();
  };
};

module.exports = {
  verifyJWT,
  authorize,
};
