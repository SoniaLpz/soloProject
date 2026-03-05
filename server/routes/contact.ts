import express = require("express");
import { submitContactForm } from '../controllers/contactController.ts';

const router = express.Router();

router.post("/", submitContactForm);

module.exports = router;
