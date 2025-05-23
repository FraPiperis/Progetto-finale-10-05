const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");

// GET /blogPosts - con paginazione
// GET /blogPosts - con paginazione e filtro titolo
router.get("/", async (req, res) => {
    const { page = 1, limit = 10, title } = req.query;
    const skip = (page - 1) * limit;
  
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // case-insensitive
    }
  
    const posts = await BlogPost.find(query)
      .skip(Number(skip))
      .limit(Number(limit));
  
    const total = await BlogPost.countDocuments(query);
  
    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: posts
    });
  });
  

// GET /blogPosts/:id - singolo post
router.get("/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send("Post non trovato");
    res.json(post);
  } catch {
    res.status(400).send("ID non valido");
  }
});

// POST /blogPosts - nuovo post
router.post("/", async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PUT /blogPosts/:id - aggiorna post
router.put("/:id", async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send("Post non trovato");
    res.json(updated);
  } catch {
    res.status(400).send("Errore durante l'aggiornamento");
  }
});

// DELETE /blogPosts/:id - cancella post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Post non trovato");
    res.send("Post eliminato");
  } catch {
    res.status(400).send("Errore durante l'eliminazione");
  }
});

module.exports = router;

const Author = require("../models/Author");

// GET /authors/:id/blogPosts - tutti i post per autore (via ID)
router.get("/authors/:id/blogPosts", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send("Autore non trovato");

    const posts = await BlogPost.find({ author: author.email });
    res.json(posts);
  } catch {
    res.status(400).send("Errore");
  }
});
