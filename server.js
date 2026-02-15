const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS : autoriser le front (à adapter selon l’origine du front)
app.use(cors());
app.use(express.json());

// --- Routes GET pour le front ---

// Santé (pour Azure et load balancers)
app.get('/', (req, res) => {
  res.json({
    message: 'API REST back-ehtp',
    version: '1.0.0',
    docs: 'GET /api/health, GET /api/items, GET /api/items/:id',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    node: process.version,
  });
});

// Exemple : liste d’items (à remplacer par ta logique / BDD)
app.get('/api/items', (req, res) => {
  const items = [
    { id: '1', label: 'Item 1', createdAt: '2025-01-01T00:00:00.000Z' },
    { id: '2', label: 'Item 2', createdAt: '2025-01-02T00:00:00.000Z' },
    { id: '3', label: 'Item 3', createdAt: '2025-01-03T00:00:00.000Z' },
  ];
  res.json(items);
});

// Exemple : un item par id
app.get('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const item = { id, label: `Item ${id}`, createdAt: new Date().toISOString() };
  res.json(item);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
