const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Article = sequelize.define("Article", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Stockage de l'ID public de Cloudinary pour la gestion des images
    imagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Champ virtuel pour compter les likes
    likesCount: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.getLikes ? this.getLikes().length : 0;
        },
    },
});

// Relation avec User (auteur)
Article.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User.hasMany(Article);

module.exports = Article;
