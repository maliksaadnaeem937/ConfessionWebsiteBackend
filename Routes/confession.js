const express = require("express");
const {
  isAuthenticated,
  ifNotAuthenticatedRedirect,
} = require("@middlewares/AuthMiddleWare/AuthMiddleWares.js");

const ConfessionController = require("@ConfessionController/ConfessionController.js");
const router = express.Router();

router.post(
  "/create-confession",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.createConfession
);

router.get(
  "/get-my-confessions",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.getMyConfessions
);

router.delete(
  "/delete-my-confession/:id",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.deleteMyConfession
);
router.put(
  "/update-confession/:id",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.updateMyConfession
);


router.get(
  "/get-all-confessions-admin",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.getALLConfessionsAdmin
);

router.patch(
  "/approve-confesion-admin/:id",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.approveConfessionAdmin
);
router.delete(
  "/delete-confesion-admin/:id",
  isAuthenticated,
  ifNotAuthenticatedRedirect,
  ConfessionController.deleteConfessionAdmin
);


module.exports = router;
