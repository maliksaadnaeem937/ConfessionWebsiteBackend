const ifNotAuthenticatedRedirect = (req, res, next) => {
  if (!req.login) {
    return res.status(400).json({
      success: false,
      message: "Please Login",
      status: 400,
    });
  } else {
    return next();
  }
};
module.exports = ifNotAuthenticatedRedirect;
