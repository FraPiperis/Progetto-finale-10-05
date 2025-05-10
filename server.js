const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authorsRoutes = require("./routes/authors");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/authors", authorsRoutes);

// Connessione a MongoDB
mongoose.connect("mongodb://localhost:27017/strive_blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => app.listen(PORT, () => console.log(`Server attivo su http://localhost:${PORT}`)))
.catch(err => console.error("Errore di connessione a MongoDB:", err));
