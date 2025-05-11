const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const { upload } = require("../cloudinary");

// GET /authors - con paginazione
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const authors = await Author.find()
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Author.countDocuments();

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    data: authors,
  });
});

// GET /authors/:id - Autore singolo
router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).send("Autore non trovato");
  res.json(author);
});

// POST /authors - Crea un nuovo autore
router.post("/", async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PUT /authors/:id - Aggiorna autore esistente
router.put("/:id", async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send("Autore non trovato");
    res.json(updated);
  } catch (err) {
    res.status(400).send("Errore durante l'aggiornamento");
  }
});

// DELETE /authors/:id - Cancella autore
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Autore non trovato");
    res.send("Autore eliminato");
  } catch (err) {
    res.status(400).send("Errore durante l'eliminazione");
  }
});

// PATCH /authors/:authorId/avatar - Carica immagine su Cloudinary
router.patch("/:authorId/avatar", upload.single("avatar"), async (req, res) => {
  const { authorId } = req.params;
  if (!req.file || !req.file.path) {
    return res.status(400).send("Immagine mancante");
  }

  const updated = await Author.findByIdAndUpdate(
    authorId,
    { avatar: req.file.path },
    { new: true }
  );

  res.status(200).send(updated);
});

module.exports = router;

