const userGameList = [];

async function searchGame() {
  const gameName = document.getElementById('gameName').value;
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = '';

  if (!gameName) {
    searchResultsDiv.innerHTML = '<p>Please enter a game name.</p>';
    return;
  }

  try {
    const response = await fetch(`/search?name=${gameName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const games = await response.json();

    if (games.length === 0) {
      searchResultsDiv.innerHTML = '<p>No games found.</p>';
      return;
    }

    games.forEach(game => {
      const gameElement = createGameElement(game, true);
      searchResultsDiv.appendChild(gameElement);
    });
  } catch (error) {
    searchResultsDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}

function createGameElement(game, isSearchResult = false) {
  const div = document.createElement('div');
  div.className = isSearchResult ? 'result-item' : 'user-game-item';

  const img = document.createElement('img');
  img.src = game.imageUrl || 'placeholder-image-url'; // Use a placeholder image URL if game.imageUrl is not available
  img.alt = game.name;

  const gameInfoDiv = document.createElement('div');
  gameInfoDiv.className = 'game-info';

  const title = document.createElement('h2');
  title.textContent = game.name;

  const details = document.createElement('p');
  details.textContent = `Main Story: ${game.gameplayMain} hours`;
  const details2 = document.createElement('p');
  details2.textContent = `Main + Extras: ${game.gameplayMainExtra} hours`;
  const details3 = document.createElement('p');
  details3.textContent = `Completionist: ${game.gameplayCompletionist} hours`;

  gameInfoDiv.appendChild(title);
  gameInfoDiv.appendChild(details);
  gameInfoDiv.appendChild(details2);
  gameInfoDiv.appendChild(details3);
  div.appendChild(img);
  div.appendChild(gameInfoDiv);

  if (isSearchResult) {
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.innerHTML = 'Add <span class="material-icons">add</span>';
    addButton.onclick = () => addToUserGameList(game);
    div.appendChild(addButton);
  }

  return div;
}

function addToUserGameList(game) {
  userGameList.push(game);
  updateUserGameList();
}

function updateUserGameList() {
  const userGameListDiv = document.getElementById('userGameList');
  userGameListDiv.innerHTML = '';

  userGameList.forEach(game => {
    const gameElement = createGameElement(game);
    userGameListDiv.appendChild(gameElement);
  });
}
