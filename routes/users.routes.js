const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controller.js");
const multer = require('../multer-config');

router.post("/signup", users.signup);

router.post("/login", users.login);

router.get("/home/users", users.getAlltUsers);

router.post("/home/users", users.getOneUser);

router.post("/home/users/images", multer, users.submitUserImage);

router.post("/home/users/images/cover", multer, users.submitCoverImg);

router.post("/home/users/info", users.editInfo);

router.delete("/home/users/images", users.deleteImageProfile);

router.delete("/home/users/images/cover", users.deleteCoverImg);

router.delete("/home/users/info", users.deleteAccount);

router.post("/home/users/search", users.searchUsers);


module.exports = router;