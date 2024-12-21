const { Comment, User } = require("../models");

const commentController = {
    // Créer un nouveau commentaire
    create: async (req, res) => {
        try {
            const { content, articleId } = req.body;
            const userId = req.user.id;

            const comment = await Comment.create({
                content,
                articleId,
                userId,
            });

            // Récupérer le commentaire avec les infos de l'utilisateur
            const commentWithUser = await Comment.findByPk(comment.id, {
                include: [
                    {
                        model: User,
                        attributes: ["id", "email"],
                    },
                ],
            });

            res.status(201).json(commentWithUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Récupérer les commentaires d'un article
    getByArticle: async (req, res) => {
        try {
            const { articleId } = req.params;

            const comments = await Comment.findAll({
                where: { articleId },
                include: [
                    {
                        model: User,
                        attributes: ["id", "email"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.json(comments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Supprimer un commentaire
    delete: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id);

            if (!comment) {
                return res
                    .status(404)
                    .json({ message: "Commentaire non trouvé" });
            }

            // Vérifier que l'utilisateur est l'auteur du commentaire
            if (comment.userId !== req.user.id) {
                return res.status(403).json({ message: "Non autorisé" });
            }

            await comment.destroy();
            res.json({ message: "Commentaire supprimé avec succès" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
module.exports = commentController;
