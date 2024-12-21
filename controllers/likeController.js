const { Like, Article } = require("../models");

const likeController = {
    // Liker/Unliker un article
    toggleLike: async (req, res) => {
        try {
            const { articleId } = req.params;
            const userId = req.user.id;

            // Vérifier si l'article existe
            const article = await Article.findByPk(articleId);
            if (!article) {
                return res.status(404).json({ message: "Article non trouvé" });
            }

            // Chercher un like existant
            const existingLike = await Like.findOne({
                where: { userId, articleId },
            });

            if (existingLike) {
                // Si le like existe, on le supprime (unlike)
                await existingLike.destroy();
                res.json({ message: "Like retiré", liked: false });
            } else {
                // Sinon, on crée un nouveau like
                await Like.create({ userId, articleId });
                res.json({ message: "Article liké", liked: true });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Vérifier si un utilisateur a liké un article
    checkLike: async (req, res) => {
        try {
            const { articleId } = req.params;
            const userId = req.user.id;

            const like = await Like.findOne({
                where: { userId, articleId },
            });

            res.json({ liked: !!like });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtenir le nombre de likes pour un article
    getLikeCount: async (req, res) => {
        try {
            const { articleId } = req.params;

            const count = await Like.count({
                where: { articleId },
            });

            res.json({ count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
module.exports = likeController;
