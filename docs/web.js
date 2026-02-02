const GAME_CATEGORIES = {
  Animals: [
    "Lion", "Elephant", "Penguin", "Dolphin", "Eagle", "Tiger", "Giraffe", "Zebra", "Kangaroo", "Panda",
    "Bear", "Wolf", "Fox", "Deer", "Monkey", "Parrot", "Whale", "Shark", "Snake", "Butterfly",
    "Owl", "Cheetah", "Hippopotamus", "Crocodile", "Rabbit"
  ],
  Fruits: [
    "Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Pineapple", "Mango", "Kiwi", "Blueberry",
    "Raspberry", "Peach", "Plum", "Cherry", "Lemon", "Lime", "Coconut", "Papaya", "Pomegranate", "Blackberry",
    "Tangerine", "Apricot", "Guava", "Date", "Fig"
  ],
  Countries: [
    "France", "Japan", "Brazil", "Australia", "Mexico", "Canada", "India", "Egypt", "Italy", "Germany",
    "Spain", "Thailand", "Norway", "Sweden", "Greece", "Turkey", "Portugal", "Netherlands", "Belgium", "Austria",
    "Switzerland", "Russia", "China", "Argentina", "South Korea"
  ],
  Food: [
    "Pizza", "Burger", "Sushi", "Taco", "Pasta", "Salad", "Sandwich", "Steak", "Chicken", "Fish",
    "Rice", "Bread", "Soup", "Curry", "Omelette", "Bacon", "Ham", "Cheese", "Butter", "Yogurt",
    "Cereal", "Candy", "Cookie", "Cake", "Donut"
  ],
  Sports: [
    "Football", "Basketball", "Tennis", "Baseball", "Hockey", "Volleyball", "Swimming", "Running", "Cycling", "Skiing",
    "Golf", "Surfing", "Wrestling", "Boxing", "Karate", "Gymnastics", "Archery", "Badminton", "Bowling", "Cricket",
    "Lacrosse", "Handball", "Rugby", "TableTennis", "Fencing"
  ],
  Movies: [
    "Avatar", "Titanic", "Inception", "Jaws", "Gladiator", "Matrix", "Shrek", "Frozen", "Lion King", "Toy Story",
    "Finding Nemo", "Avengers", "Jurassic Park", "Terminator", "Batman", "Superman", "Spiderman", "Wonder Woman", "Thor", "Iron Man",
    "Captain America", "Aquaman", "Black Panther", "Deadpool", "Joker"
  ],
  Professions: [
    "Doctor", "Teacher", "Engineer", "Lawyer", "Pilot", "Nurse", "Mechanic", "Chef", "Architect", "Programmer",
    "Artist", "Musician", "Actor", "Photographer", "Journalist", "Scientist", "Farmer", "Carpenter", "Plumber", "Electrician",
    "Accountant", "Manager", "Police Officer", "Firefighter", "Soldier"
  ],
  Colors: [
    "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White",
    "Gray", "Cyan", "Magenta", "Lime", "Indigo", "Violet", "Turquoise", "Gold", "Silver", "Beige",
    "Maroon", "Navy", "Olive", "Coral", "Crimson"
  ],
  Technology: [
    "Computer", "Phone", "Laptop", "Tablet", "Robot", "Drone", "Camera", "Microphone", "Monitor", "Keyboard",
    "Mouse", "Printer", "Scanner", "Television", "Radio", "Speaker", "Headphone", "Console", "Processor", "Battery",
    "Server", "Router", "Modem", "Charger", "Cable"
  ],
  Weather: [
    "Sunshine", "Rain", "Snow", "Thunder", "Lightning", "Wind", "Fog", "Hail", "Tornado", "Hurricane",
    "Blizzard", "Drizzle", "Mist", "Sleet", "Frost", "Rainbow", "Cloud", "Breeze", "Gust", "Downpour",
    "Tempest", "Cyclone", "Monsoon", "Drought", "Heatwave"
  ]
};

const state = {
  players: [],
  category: null,
  secretWord: null,
  imposter: null,
  revealIndex: 0,
  votes: {}
};

const elements = {
  playerName: document.getElementById("player-name"),
  addPlayer: document.getElementById("add-player"),
  startGame: document.getElementById("start-game"),
  playerList: document.getElementById("player-list"),
  setupCard: document.getElementById("setup-card"),
  revealCard: document.getElementById("reveal-card"),
  revealCounter: document.getElementById("reveal-counter"),
  revealPlayer: document.getElementById("reveal-player"),
  revealInfo: document.getElementById("reveal-info"),
  revealRole: document.getElementById("reveal-role"),
  revealCategory: document.getElementById("reveal-category"),
  revealWord: document.getElementById("reveal-word"),
  revealButton: document.getElementById("reveal-button"),
  nextPlayer: document.getElementById("next-player"),
  discussionCard: document.getElementById("discussion-card"),
  startVoting: document.getElementById("start-voting"),
  votingCard: document.getElementById("voting-card"),
  voteArea: document.getElementById("vote-area"),
  submitVotes: document.getElementById("submit-votes"),
  resultsCard: document.getElementById("results-card"),
  resultMessage: document.getElementById("result-message"),
  resultImposter: document.getElementById("result-imposter"),
  resultWord: document.getElementById("result-word"),
  resultVotes: document.getElementById("result-votes"),
  restart: document.getElementById("restart")
};

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

const resetState = () => {
  state.players = [];
  state.category = null;
  state.secretWord = null;
  state.imposter = null;
  state.revealIndex = 0;
  state.votes = {};
};

const renderPlayers = () => {
  elements.playerList.innerHTML = "";
  state.players.forEach((player, index) => {
    const item = document.createElement("li");
    item.textContent = player;
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("secondary");
    removeButton.addEventListener("click", () => {
      state.players.splice(index, 1);
      renderPlayers();
    });
    item.appendChild(removeButton);
    elements.playerList.appendChild(item);
  });
};

const showCard = (card) => {
  [
    elements.setupCard,
    elements.revealCard,
    elements.discussionCard,
    elements.votingCard,
    elements.resultsCard
  ].forEach((section) => {
    section.classList.toggle("hidden", section !== card);
  });
};

const startGame = () => {
  if (state.players.length < 2) {
    alert("Add at least two players to start.");
    return;
  }

  const categoryKeys = Object.keys(GAME_CATEGORIES);
  state.category = randomFromArray(categoryKeys);
  state.secretWord = randomFromArray(GAME_CATEGORIES[state.category]);
  state.imposter = randomFromArray(state.players);
  state.revealIndex = 0;
  state.votes = {};

  showCard(elements.revealCard);
  updateReveal();
};

const updateReveal = () => {
  const player = state.players[state.revealIndex];
  elements.revealCounter.textContent = `Player ${state.revealIndex + 1} of ${state.players.length}`;
  elements.revealPlayer.textContent = player;
  elements.revealInfo.classList.add("hidden");
  elements.revealButton.disabled = false;
};

const revealInfo = () => {
  const player = state.players[state.revealIndex];
  const isImposter = player === state.imposter;

  elements.revealRole.textContent = isImposter ? "Imposter" : "Innocent";
  elements.revealCategory.textContent = state.category;
  elements.revealWord.textContent = state.secretWord;
  elements.revealInfo.classList.remove("hidden");
  elements.revealButton.disabled = true;
};

const goToNextPlayer = () => {
  if (state.revealIndex < state.players.length - 1) {
    state.revealIndex += 1;
    updateReveal();
    return;
  }

  showCard(elements.discussionCard);
};

const buildVoting = () => {
  elements.voteArea.innerHTML = "";
  state.players.forEach((player) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card");
    const label = document.createElement("label");
    label.textContent = `${player}'s vote`;
    const select = document.createElement("select");
    select.innerHTML = "<option value=\"\">Select a suspect</option>";

    state.players
      .filter((name) => name !== player)
      .forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });

    select.addEventListener("change", (event) => {
      state.votes[player] = event.target.value;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    elements.voteArea.appendChild(wrapper);
  });
};

const submitVotes = () => {
  const missingVote = state.players.find((player) => !state.votes[player]);
  if (missingVote) {
    alert(`Please select a vote for ${missingVote}.`);
    return;
  }

  const imposterVotes = Object.values(state.votes).filter((vote) => vote === state.imposter).length;
  const groupWins = imposterVotes > state.players.length / 2;

  elements.resultMessage.textContent = groupWins
    ? "🎯 Group wins! The imposter has been discovered."
    : "🕵️ Imposter wins! They remained hidden.";
  elements.resultImposter.textContent = state.imposter;
  elements.resultWord.textContent = state.secretWord;

  elements.resultVotes.innerHTML = "";
  const votesList = document.createElement("ul");
  Object.entries(state.votes).forEach(([voter, suspect]) => {
    const item = document.createElement("li");
    item.textContent = `${voter} voted for ${suspect}`;
    votesList.appendChild(item);
  });
  elements.resultVotes.appendChild(votesList);

  showCard(elements.resultsCard);
};

const restartGame = () => {
  resetState();
  renderPlayers();
  showCard(elements.setupCard);
};

const addPlayer = () => {
  const name = elements.playerName.value.trim();
  if (!name) {
    return;
  }
  state.players.push(name);
  elements.playerName.value = "";
  renderPlayers();
};

elements.addPlayer.addEventListener("click", addPlayer);

elements.playerName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addPlayer();
  }
});

elements.startGame.addEventListener("click", startGame);
elements.revealButton.addEventListener("click", revealInfo);
elements.nextPlayer.addEventListener("click", goToNextPlayer);
elements.startVoting.addEventListener("click", () => {
  buildVoting();
  showCard(elements.votingCard);
});

elements.submitVotes.addEventListener("click", submitVotes);
elements.restart.addEventListener("click", restartGame);

renderPlayers();
