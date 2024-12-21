const express = require("express");
const router = express.Router();
const { commentController } = require("../controllers/commentController");
const { auth } = require("../middlewares/auth");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validation");

// Validation des commentaires
const commentValidation = [
    body("content")
        .notEmpty()
        .withMessage("Le contenu est requis")
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage("Le commentaire doit contenir entre 2 et 500 caractères"),
    body("articleId")
        .notEmpty()
        .withMessage("L'ID de l'article est requis")
        .isUUID()
        .withMessage("ID d'article invalide"),
];

// Routes publiques
router.get("/article/:articleId", commentController.getByArticle);

// Routes protégées
router.post(
    "/",
    auth,
    commentValidation,
    validateRequest,
    commentController.create
);

router.delete("/:id", auth, commentController.delete);

module.exports = router;
