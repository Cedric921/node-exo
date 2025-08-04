const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Article = require("./Article");

const Like = sequelize.define(
    "like",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        // Pas besoin d'autres champs car la relation elle-même représente le like
    },
    {
        // Garantir qu'un utilisateur ne peut liker qu'une fois un article
        indexes: [
            {
                unique: true,
                fields: ["userId", "articleId"],
            },
        ],
    }
);

// Relations
Like.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User.hasMany(Like);

Like.belongsTo(Article, {
    foreignKey: {
        name: "articleId",
        allowNull: false,
    },
});
Article.hasMany(Like);

module.exports = Like;
