const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { auth } = require("../middlewares/auth");
const { upload, handleMulterError } = require("../middlewares/upload");
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/upload");

// Validation des articles
const articleValidation = [
    body("title")
        .notEmpty()
        .withMessage("Le titre est requis")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Le titre doit contenir entre 3 et 100 caractères"),
    body("content")
        .notEmpty()
        .withMessage("Le contenu est requis")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Le contenu doit contenir au moins 10 caractères"),
];

// Routes publiques
router.get("/", articleController.getAll);
router.get("/:id", articleController.getOne);

// Routes protégées
router.post(
    "/",
    auth,
    upload,
    handleMulterError,
    articleValidation,
    validateRequest,
    articleController.create
);

router.put(
    "/:id",
    auth,
    upload,
    handleMulterError,
    articleValidation,
    validateRequest,
    articleController.update
);

router.delete("/:id", auth, articleController.delete);

module.exports = router;
