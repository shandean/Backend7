const express = require("express");
const router = express.Router();
const post = require("../controllers/post.controller");
const multer = require('../multer-config');


router.post("", multer, post.submitPost);

router.get("", post.getAllPost);

router.post("/profile", post.getSpecificPost);

router.delete("", post.deletePost);




module.exports = router;