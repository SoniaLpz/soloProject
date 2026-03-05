import express = require("express");
import { register, login } from '../controllers/authController.ts';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
