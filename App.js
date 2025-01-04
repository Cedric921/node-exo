const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./config/database");

require("dotenv").config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/likes", require("./routes/likeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Gestionnaire d erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Une erreur est survenue",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

syncDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
