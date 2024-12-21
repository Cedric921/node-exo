const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
    signup: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.create({ email, password });
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res
                    .status(404)
                    .json({ error: "Utilisateur non trouvé" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res
                    .status(401)
                    .json({ error: "Mot de passe incorrect" });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = authController;
