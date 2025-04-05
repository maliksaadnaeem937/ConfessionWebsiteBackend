class MyError extends Error {
  constructor(status, message) {
    super(message || "Backend Error!");
    this.status = status || 500;
  }

  static errorMiddleWare = (err, res) => {
    const message = err.message || "backend error";
    const status = err.status || 500;

    return res.status(status).json({
      message,
      status,
      success: false,
    });
  };
}

module.exports = MyError;
