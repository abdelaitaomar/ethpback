const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Données de démo : matchs du jour (live + résultats)
const matchesOfDay = [
  { id: '1', home: 'Équipe A', away: 'Équipe B', homeScore: 2, awayScore: 1, status: 'live', minute: 67, competition: 'Ligue 1' },
  { id: '2', home: 'Équipe C', away: 'Équipe D', homeScore: 0, awayScore: 0, status: 'live', minute: 23, competition: 'Ligue 1' },
  { id: '3', home: 'Équipe E', away: 'Équipe F', homeScore: 3, awayScore: 2, status: 'finished', minute: 90, competition: 'Ligue 1' },
  { id: '4', home: 'Équipe G', away: 'Équipe H', homeScore: 1, awayScore: 1, status: 'finished', minute: 90, competition: 'Coupe' },
];

/**
 * GET /api/matches/live
 * Liste des matchs du jour qui sont en direct
 */
app.get('/api/matches/live', (req, res) => {
  const live = matchesOfDay.filter(m => m.status === 'live');
  res.json({
    success: true,
    count: live.length,
    data: live,
  });
});

/**
 * GET /api/matches/results
 * Résultats des matchs du jour (terminés)
 */
app.get('/api/matches/results', (req, res) => {
  const results = matchesOfDay.filter(m => m.status === 'finished');
  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

/**
 * GET /api/matches
 * Tous les matchs du jour (optionnel, pour le front)
 */
app.get('/api/matches', (req, res) => {
  res.json({
    success: true,
    count: matchesOfDay.length,
    data: matchesOfDay,
  });
});

// Health check pour Azure
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'back-ehtp' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
