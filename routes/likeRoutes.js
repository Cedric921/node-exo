const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const auth = require("../middlewares/auth");

// Routes publiques
router.get("/count/:articleId", likeController.getLikeCount);

// Routes protégées
router.post("/toggle/:articleId", auth, likeController.toggleLike);

router.get("/check/:articleId", auth, likeController.checkLike);

module.exports = router;
