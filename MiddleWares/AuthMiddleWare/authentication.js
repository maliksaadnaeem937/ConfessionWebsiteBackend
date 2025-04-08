const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
  // const authHeader = req.headers["authorization"];

  // if (!authHeader && !refreshToken) {
  //   req.login = false;
  //   return next();
  // }

  // const accessToken = authHeader?.split(" ")[1];

  console.log("inside authentication.js");
  console.log(req.headers);
  const refreshToken = req.cookies?.refreshToken || "";
  const accessToken = req.cookies?.accessToken || "";
  if (!accessToken) {
    req.login = false;
    return next();
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (!err) {
      req.accessToken = accessToken;
      req.refreshToken = refreshToken || null;
      req.user = user;
      req.login = true;
      return next();
    }

    if (err.name === "TokenExpiredError" && refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (refreshErr, user) => {
          if (refreshErr) {
            req.login = false;
            return next();
          }

          const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
          });

          req.user = user;
          req.login = true;
          req.accessToken = newAccessToken;
          req.refreshToken = refreshToken;

          return next();
        }
      );
    } else {
      req.login = false;
      return next();
    }
  });
};

module.exports = isAuthenticated;
