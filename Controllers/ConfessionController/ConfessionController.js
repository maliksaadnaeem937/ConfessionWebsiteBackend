const MyError = require("@middlewares/Error.js");
const { VerifiedUserModel } = require("@models/user.js");
const ConfessionModel = require("@models/confession.js");

class ConfessionControllers {
  static createConfession = async (req, res, next) => {
    try {
      const { user } = req;
      const text = req.body?.text;
      if (!user || !user?.email || !user?.id) {
        throw new MyError(400, "Invalid User");
      }
      if (!text || text?.length < 5 || text?.length > 1000) {
        throw new MyError(400, "Min:5 Max:1000");
      }

      const newConfession = new ConfessionModel({
        text,
        user: user.objectId,
      });
      await newConfession.save();

      return res.status(201).json({
        message: "Created",
        status: 201,
        success: true,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };
  static addComment = async (req, res, next) => {
    try {
      const { confessionId } = req.params;
      const { text } = req.body;
      const userId = req.user.objectId;

      if (!text || text.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Comment must be at least 5 characters long",
        });
      }

      // Find confession and add comment
      const confession = await ConfessionModel.findByIdAndUpdate(
        confessionId,
        {
          $push: {
            comments: {
              user: userId,
              text: text.trim(),
            },
          },
        },
        { new: true, runValidators: true }
      );

      if (!confession) {
        return res
          .status(404)
          .json({ success: false, message: "Confession not found" });
      }

      // Get the newly added comment (last in array)
      const newComment = confession.comments[confession.comments.length - 1];

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: newComment,
        status: 201,
      });
    } catch (error) {
      MyError.errorMiddleWare(error, res);
    }
  };

  // delete
  static deleteMyConfession = async (req, res, next) => {
    try {
      const id = req.params?.id;
      if (!id) {
        throw new MyError(400, "Invalid User");
      }
      const deleted = await ConfessionModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new MyError(404, "Confession Not Found");
      }
      return res.status(200).json({
        success: true,
        message: "Deleted",
        status: 200,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };

  // get all for user
  static getMyConfessions = async (req, res, next) => {
    try {
      const { user } = req;
      if (!user || !user?.email || !user?.id) {
        throw new MyError(400, "Invalid User");
      }
      const verifiedUser = await VerifiedUserModel.findOne({ id: user.id });
      if (!verifiedUser) {
        throw new MyError(404, "Invalid Confession");
      }

      user.objectId = verifiedUser?._id;
      const confessions = await ConfessionModel.find({
        user: user.objectId,
      })
        .populate("user", "email")
        .select("-__v")
        .exec();

      return res.status(200).json({
        message: "Confessions found!",
        data: confessions,
        status: 200,
        success: true,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };
  static getALLConfessions = async (req, res, next) => {
    try {
      const confessions = await ConfessionModel.find({})
        .select("-__v")
        .populate({
          path: "user", // Populate the user field in the confession
          select: "name",
        })
        .populate({
          path: "comments.user", // Populate the user field in each comment
          select: "name",
        })
        .exec();
      return res.status(200).json({
        message: "Confessions found!",
        data: confessions,
        status: 200,
        success: true,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };

  static updateMyConfession = async (req, res, next) => {
    try {
      const { text } = req.body;
      const id = req.params?.id;
      if (!text || text?.length < 5 || text?.length > 1000) {
        throw new MyError(400, "Min:5 Max:100");
      }
      if (!id) {
        throw new MyError(400, "Invalid Request");
      }
      const updated = await ConfessionModel.findBYIdAndUpdate(
        id,
        { text },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({
          error: "Confession not found!",
          status: 400,
          success: false,
        });
      }

      return res.status(200).json({
        message: "updated",
        success: true,
        updated,
        status: 200,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };

  // get all for admin

  static getALLConfessionsAdmin = async (req, res, next) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(401).json({
          message: "Unauthorized",
          success: false,
        });
      }
      const confessions = await ConfessionModel.find({}).exec();
      return res.status(200).json({
        success: true,
        message: "ok",
        data: confessions,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };
  static approveConfessionAdmin = async (req, res, next) => {
    try {
      if (req?.user?.role !== "admin") {
        throw new MyError(401, "Unauthorized");
      }
      const id = req.params?.id;
      if (!id) {
        throw new MyError(400, "Invalid Request");
      }
      const updated = await ConfessionModel.findBYIdAndUpdate(
        id,
        { $set: { isApproved: true } },
        { new: true }
      );
      return res.status(200).json({
        message: "Updated",
        status: 200,
        success: true,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };
  static deleteConfessionAdmin = async (req, res, next) => {
    try {
      if (req?.user?.role !== "admin") {
        throw new MyError(401, "Unauthorized");
      }
      const id = req.params?.id;
      if (!id) {
        throw new MyError(400, "Invalid Request");
      }
      const isDeleted = await ConfessionModel.findByIdAndDelete(id);
      if (!isDeleted) {
        throw new MyError(404, "Not Found");
      }
      return res.status(200).json({
        message: "Deleted",
        success: true,
        status: 200,
      });
    } catch (e) {
      return MyError.errorMiddleWare(e, res);
    }
  };
}

module.exports = ConfessionControllers;
