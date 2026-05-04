import express from "express";
import {sign_up,confirm_get,confirm,log_in,forgot,verify,reset} from "../controllers/auth_controllers.js"
const router = express.Router();
router.post("/register", sign_up);
router.get("/confirm_link", confirm_get);
router.post("/confirm", confirm);
router.post("/login", log_in);
router.post("/forgot", forgot);
router.post("/verify", verify);
router.post("/reset", reset);

export default router;
