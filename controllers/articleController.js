const { Article } = require("../models/Article");
const { User } = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Créer un nouvel article
(exports.create = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id; // Fourni par le middleware d'auth

        let imageUrl = null;
        let imagePublicId = null;

        // Si une image est fournie
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const article = await Article.create({
            title,
            content,
            imageUrl,
            imagePublicId,
            userId,
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}),
    // Récupérer tous les articles
    (exports.getAll = async (req, res) => {
        try {
            const articles = await Article.findAll({
                include: [
                    {
                        model: User,
                        attributes: ["id", "email"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            res.json(articles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    // Récupérer un article spécifique
    (exports.getOne = async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ["id", "email"],
                    },
                ],
            });

            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    // Mettre à jour un article
    (exports.update = async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id);

            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            // Vérifier que l'utilisateur est bien l'auteur
            if (article.userId !== req.user.id) {
                return res.status(403).json({ message: "Non autorisé" });
            }

            const { title, content } = req.body;

            // Gérer la mise à jour de l'image
            if (req.file) {
                // Supprimer l'ancienne image si elle existe
                if (article.imagePublicId) {
                    await cloudinary.uploader.destroy(article.imagePublicId);
                }

                const result = await cloudinary.uploader.upload(req.file.path);
                await article.update({
                    title,
                    content,
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id,
                });
            } else {
                await article.update({ title, content });
            }

            res.json(article);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    // Supprimer un article
    (exports.delete = async (req, res) => {
        try {
            const article = await Article.findByPk(req.params.id);

            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            // Vérifier que l'utilisateur est bien l'auteur
            if (article.userId !== req.user.id) {
                return res.status(403).json({ message: "Non autorisé" });
            }

            // Supprimer l'image de Cloudinary si elle existe
            if (article.imagePublicId) {
                await cloudinary.uploader.destroy(article.imagePublicId);
            }

            await article.destroy();
            res.json({ message: "Article supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
