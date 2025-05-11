
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authorsRoutes = require("./routes/authors");
const blogPostRoutes = require("./routes/blogPosts");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/authors", authorsRoutes);       // Es: /authors/:id/avatar
app.use("/blogPosts", blogPostRoutes);    // Es: /blogPosts/:id

// Connessione a MongoDB
mongoose.connect("mongodb://localhost:27017/strive_blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connesso a MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server attivo su http://localhost:${PORT}`));
})
.catch(err => console.error("❌ Errore di connessione a MongoDB:", err));
