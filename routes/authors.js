const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// GET /authors - Lista di tutti gli autori
router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

// GET /authors/:id - Autore singolo
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
      data: authors
    });
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

module.exports = router;
