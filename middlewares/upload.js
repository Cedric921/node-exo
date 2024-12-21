const multer = require("multer");
const path = require("path");

// Configuration du stockage temporaire
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Stockage temporaire avant upload vers Cloudinary
        cb(null, "/tmp");
    },
    filename: function (req, file, cb) {
        // Génération d'un nom de fichier unique
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

// Filtre pour les types de fichiers
const fileFilter = (req, file, cb) => {
    // Accepter uniquement les images
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Le fichier doit être une image"), false);
    }
};

// Configuration de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite à 5MB
    },
});

// Middleware de gestion d'erreur pour Multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message:
                    "Le fichier est trop volumineux. Taille maximale : 5MB",
            });
        }
        return res.status(400).json({ message: error.message });
    }

    if (error.message === "Le fichier doit être une image") {
        return res.status(400).json({ message: error.message });
    }

    next(error);
};

module.exports = {
    upload: upload.single("image"), // Configuration pour un seul fichier avec le nom 'image'
    handleMulterError,
};

// middlewares/validation.js (Bonus : middleware de validation des données)
const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    upload,
    handleMulterError,
    validateRequest,
};
