const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
    }
);

// Fonction de synchronisation des Tableau

const syncDatabase = async () => {
    try {
        // Test de connexion
        await sequelize.authenticate();
        console.log("Connexion à la base de données réussie");

        // Synchronisation des modèles
        await sequelize.sync({ alter: true });
        console.log("Tables synchronisées avec succès");
    } catch (error) {
        console.error("Erreur de synchronisation:", error);
    }
};

module.exports = { sequelize, syncDatabase };
