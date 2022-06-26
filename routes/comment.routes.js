const express = require("express");
const router = express.Router();
const comment = require("../controllers/comment.controller")

router.post("", comment.submitComment);
router.get("", comment.getComment);
router.delete("", comment.deleteComment);
router.post("/edit", comment.editComment);



module.exports = router;