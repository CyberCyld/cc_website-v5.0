const express = require("express");
const usersController = require("./user");
const router = express.Router();

router.post("/register", usersController.register );
router.post("/login", usersController.login);
router.get("/logout", usersController.logout);
router.get("/admindashboard", usersController.home);
module.exports = router;