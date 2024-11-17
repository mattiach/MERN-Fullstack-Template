import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
  deleteUserProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/verify/:uniqueString", verifyUserEmail);
router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").put(protect, updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:id/:token", resetPassword);
router.route('/delete').delete(protect, deleteUserProfile);

export default router;
