const ifNotAuthenticatedRedirect = (req, res, next) => {
  if (!req.login) {
    return res.status(301).json({
      success: false,
      message: "Please Login",
      status: 301,
    });
  } else {
    return next();
  }
};
module.exports = ifNotAuthenticatedRedirect;
