const express = require("express");
const router = express.Router();
const like = require("../controllers/like.controller")

router.post("", like.sendLike);

router.get("", like.getLikes);





module.exports = router;