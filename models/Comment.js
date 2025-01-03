const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Article = require("./Article");

const Comment = sequelize.define("comment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    // Pour ordonner les commentaires
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Relations
Comment.belongsTo(User, {
    foreignKey: {
        name: "userId",
        allowNull: false,
    },
});
User.hasMany(Comment);

Comment.belongsTo(Article, {
    foreignKey: {
        name: "articleId",
        allowNull: false,
    },
});
Article.hasMany(Comment);

module.exports = Comment;
