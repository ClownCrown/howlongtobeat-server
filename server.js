const express = require('express');
const { HowLongToBeatService } = require('howlongtobeat');

const app = express();
const port = 3000;
const hltbService = new HowLongToBeatService();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to search for game data
app.get('/search', async (req, res) => {
  const gameName = req.query.name;
  if (!gameName) {
    return res.status(400).send({ error: 'Game name is required' });
  }

  try {
    let results = await hltbService.search(gameName);
    results = results.filter(r => r.gameplayMain > 0)
    results.sort((a,b) => (b.similarity - a.similarity) )
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to fetch game data' });
  }
});

// Endpoint to get detailed information about a specific game
app.get('/game/:id', async (req, res) => {
  const gameId = req.params.id;

  try {
    const gameDetail = await hltbService.detail(gameId);
    res.send(gameDetail);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch game details' });
  }
});

// New endpoint to get a list of matching game names based on partial name
app.get('/search/match', async (req, res) => {
  const partialName = req.query.partialName;
  if (!partialName) {
    return res.status(400).send({ error: 'Partial game name is required' });
  }

  try {
    const results = await hltbService.search(partialName);
    const matchingNames = results.map(game => game.name);
    res.send(matchingNames);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch matching game names' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
