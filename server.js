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

let nextId = 5;

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

/**
 * POST /api/matches
 * Ajouter un match
 * Body: { home, away, homeScore?, awayScore?, status?, minute?, competition? }
 */
app.post('/api/matches', (req, res) => {
  const { home, away, homeScore, awayScore, status, minute, competition } = req.body || {};

  if (!home || !away) {
    return res.status(400).json({
      success: false,
      error: 'Les champs "home" et "away" sont obligatoires',
    });
  }

  const match = {
    id: String(nextId++),
    home: String(home).trim(),
    away: String(away).trim(),
    homeScore: homeScore != null ? Number(homeScore) : 0,
    awayScore: awayScore != null ? Number(awayScore) : 0,
    status: status === 'live' || status === 'finished' ? status : 'live',
    minute: minute != null ? Number(minute) : 0,
    competition: competition != null ? String(competition).trim() : '',
  };

  matchesOfDay.push(match);

  res.status(201).json({
    success: true,
    data: match,
  });
});

/**
 * PUT /api/matches/:id
 * Modifier un match
 */
app.put('/api/matches/:id', (req, res) => {
  const id = req.params.id;
  const index = matchesOfDay.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Match non trouvé' });
  }

  const { home, away, homeScore, awayScore, status, minute, competition } = req.body || {};
  const current = matchesOfDay[index];

  const updated = {
    id: current.id,
    home: home != null ? String(home).trim() : current.home,
    away: away != null ? String(away).trim() : current.away,
    homeScore: homeScore != null ? Number(homeScore) : current.homeScore,
    awayScore: awayScore != null ? Number(awayScore) : current.awayScore,
    status: status === 'live' || status === 'finished' ? status : current.status,
    minute: minute != null ? Number(minute) : current.minute,
    competition: competition != null ? String(competition).trim() : current.competition,
  };

  if (!updated.home || !updated.away) {
    return res.status(400).json({
      success: false,
      error: 'Les champs "home" et "away" sont obligatoires',
    });
  }

  matchesOfDay[index] = updated;
  res.json({ success: true, data: updated });
});

/**
 * DELETE /api/matches/:id
 * Supprimer un match
 */
app.delete('/api/matches/:id', (req, res) => {
  const id = req.params.id;
  const index = matchesOfDay.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Match non trouvé' });
  }
  matchesOfDay.splice(index, 1);
  res.json({ success: true, deleted: id });
});

// Health check pour Azure
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'back-ehtp' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
