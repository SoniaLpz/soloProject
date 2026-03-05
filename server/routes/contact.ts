import express = require("express");
import { submitContactForm } from '../controllers/contactController';

const router = express.Router();

router.post("/", submitContactForm);

module.exports = router;
