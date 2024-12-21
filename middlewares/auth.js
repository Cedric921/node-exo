const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const auth = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Token d'authentification manquant" });
        }

        // Extraire le token
        const token = authHeader.split(" ")[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Récupérer l'utilisateur
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error();
        }

        // Ajouter l'utilisateur à l'objet request
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentification non valide,thanks" });
    }
};

module.exports = auth;
