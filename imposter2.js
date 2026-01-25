const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify question for async/await
const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
};

// Game categories with 25 words each
const GAME_CATEGORIES = {
    "Animals": ["Lion", "Elephant", "Penguin", "Dolphin", "Eagle", "Tiger", "Giraffe", "Zebra", "Kangaroo", "Panda",
                "Bear", "Wolf", "Fox", "Deer", "Monkey", "Parrot", "Whale", "Shark", "Snake", "Butterfly",
                "Owl", "Cheetah", "Hippopotamus", "Crocodile", "Rabbit"],

    "Fruits": ["Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Pineapple", "Mango", "Kiwi", "Blueberry",
               "Raspberry", "Peach", "Plum", "Cherry", "Lemon", "Lime", "Coconut", "Papaya", "Pomegranate", "Blackberry",
               "Tangerine", "Apricot", "Guava", "Date", "Fig"],

    "Countries": ["France", "Japan", "Brazil", "Australia", "Mexico", "Canada", "India", "Egypt", "Italy", "Germany",
                  "Spain", "Thailand", "Norway", "Sweden", "Greece", "Turkey", "Portugal", "Netherlands", "Belgium", "Austria",
                  "Switzerland", "Russia", "China", "Argentina", "South Korea"],

    "Food": ["Pizza", "Burger", "Sushi", "Taco", "Pasta", "Salad", "Sandwich", "Steak", "Chicken", "Fish",
             "Rice", "Bread", "Soup", "Curry", "Omelette", "Bacon", "Ham", "Cheese", "Butter", "Yogurt",
             "Cereal", "Candy", "Cookie", "Cake", "Donut"],

    "Sports": ["Football", "Basketball", "Tennis", "Baseball", "Hockey", "Volleyball", "Swimming", "Running", "Cycling", "Skiing",
               "Golf", "Surfing", "Wrestling", "Boxing", "Karate", "Gymnastics", "Archery", "Badminton", "Bowling", "Cricket",
               "Lacrosse", "Handball", "Rugby", "TableTennis", "Fencing"],

    "Movies": ["Avatar", "Titanic", "Inception", "Jaws", "Gladiator", "Matrix", "Shrek", "Frozen", "Lion King", "Toy Story",
               "Finding Nemo", "Avengers", "Jurassic Park", "Terminator", "Batman", "Superman", "Spiderman", "Wonder Woman", "Thor", "Iron Man",
               "Captain America", "Aquaman", "Black Panther", "Deadpool", "Joker"],

    "Professions": ["Doctor", "Teacher", "Engineer", "Lawyer", "Pilot", "Nurse", "Mechanic", "Chef", "Architect", "Programmer",
                    "Artist", "Musician", "Actor", "Photographer", "Journalist", "Scientist", "Farmer", "Carpenter", "Plumber", "Electrician",
                    "Accountant", "Manager", "Police Officer", "Firefighter", "Soldier"],

    "Colors": ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White",
               "Gray", "Cyan", "Magenta", "Lime", "Indigo", "Violet", "Turquoise", "Gold", "Silver", "Beige",
               "Maroon", "Navy", "Olive", "Coral", "Crimson"],

    "Technology": ["Computer", "Phone", "Laptop", "Tablet", "Robot", "Drone", "Camera", "Microphone", "Monitor", "Keyboard",
                   "Mouse", "Printer", "Scanner", "Television", "Radio", "Speaker", "Headphone", "Console", "Processor", "Battery",
                   "Server", "Router", "Modem", "Charger", "Cable"],

    "Weather": ["Sunshine", "Rain", "Snow", "Thunder", "Lightning", "Wind", "Fog", "Hail", "Tornado", "Hurricane",
                "Blizzard", "Drizzle", "Mist", "Sleet", "Frost", "Rainbow", "Cloud", "Breeze", "Gust", "Downpour",
                "Tempest", "Cyclone", "Monsoon", "Drought", "Heatwave"]
};

class GuessTheImposter {
    constructor(players, category = null, secretWord = null) {
        this.players = players;
        const categoryKeys = Object.keys(GAME_CATEGORIES);
        this.category = category || categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        this.secretWord = secretWord || GAME_CATEGORIES[this.category][Math.floor(Math.random() * GAME_CATEGORIES[this.category].length)];
        this.imposter = players[Math.floor(Math.random() * players.length)];
        this.clues = {};
        this.votes = {};
    }

    giveClue(player, clue) {
        this.clues[player] = clue;
    }

    displayClues() {
        for (const [player, clue] of Object.entries(this.clues)) {
            console.log(`${player}: ${clue}`);
        }
    }

    castVote(voter, suspect) {
        this.votes[voter] = suspect;
    }

    determineWinner() {
        const imposterVotes = Object.values(this.votes).filter(vote => vote === this.imposter).length;
        
        if (imposterVotes > this.players.length / 2) {
            return "Group wins! Imposter identified.";
        } else {
            return "Imposter wins! Remained hidden.";
        }
    }

    getImposter() {
        return this.imposter;
    }

    clearScreen() {
        console.clear();
    }

    async passPhoneToEachPlayer() {
        for (const player of this.players) {
            this.clearScreen();
            console.log("=".repeat(50));
            console.log(`🔐 CONFIDENTIAL - Phone passed to: ${player}`);
            console.log("=".repeat(50));

            if (player === this.imposter) {
                console.log(`\n✓ ${player}, YOU ARE THE IMPOSTER! 🕵️`);
                console.log(`Category: ${this.category}`);
                console.log(`Secret word: ${this.secretWord}`);
                console.log("\nYour goal: Blend in with your clues and avoid detection!");
            } else {
                console.log(`\n✓ ${player}, you are NOT the imposter. 👤`);
                console.log(`Category: ${this.category}`);
                console.log(`Secret word: ${this.secretWord}`);
                console.log("\nYour goal: Find the imposter among the group!");
            }

            console.log("\n" + "=".repeat(50));
            await question("\nPress Enter to pass the phone to the next person...\n");
        }
    }

    async discussionPhase() {
        this.clearScreen();
        console.log("=".repeat(50));
        console.log("💬 DISCUSSION PHASE - TIME TO TALK! 💬");
        console.log("=".repeat(50));
        console.log("\nAll players know who they are. Now discuss:");
        console.log("- Give clues (don't reveal the exact word)");
        console.log("- Try to identify the imposter");
        console.log("- The imposter tries to blend in");
        console.log("\nTake as much time as you need to discuss!");
        console.log("=".repeat(50));
        await question("\nPress Enter when ready to move to voting...\n");
    }

    async votingPhase() {
        this.clearScreen();
        console.log("=".repeat(50));
        console.log("🗳️ VOTING PHASE - WHO IS THE IMPOSTER? 🗳️");
        console.log("=".repeat(50));
        console.log("\nEach player votes for who they think is the imposter.");
        console.log(`Players: ${this.players.join(", ")}\n`);

        for (const player of this.players) {
            let validVote = false;
            while (!validVote) {
                const vote = await question(`${player}, who is the imposter? `);
                if (this.players.includes(vote) && vote !== player) {
                    this.castVote(player, vote);
                    validVote = true;
                } else {
                    console.log("❌ Invalid vote. Enter a valid player name (not yourself).");
                }
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 RESULTS:");
        console.log("=".repeat(50));
        for (const [voter, suspect] of Object.entries(this.votes)) {
            console.log(`${voter} voted for: ${suspect}`);
        }

        const result = this.determineWinner();
        console.log(`\n🎯 ${result}`);
        console.log(`The imposter was: ${this.getImposter()}`);
        console.log(`Secret word was: ${this.secretWord}`);
        console.log("=".repeat(50));
    }
}

// Main game function
async function main() {
    console.log("=".repeat(50));
    console.log("🎮 WELCOME TO GUESS THE IMPOSTER! 🎮");
    console.log("=".repeat(50));
    console.log("\nEnter the names of all players (one per line).");
    console.log("Type 'done' when finished.\n");

    const players = [];
    while (true) {
        const name = await question(`Player ${players.length + 1} name: `);
        if (name.toLowerCase() === "done") {
            if (players.length >= 2) {
                break;
            } else {
                console.log("❌ You need at least 2 players!");
            }
        } else if (name.trim()) {
            players.push(name.trim());
        }
    }

    console.log(`\n✓ Game starting with ${players.length} players: ${players.join(", ")}`);
    await question("\nPress Enter to begin...\n");

    let roundNumber = 1;

    while (true) {
        console.log("\n" + "=".repeat(50));
        console.log(`🎮 ROUND ${roundNumber} 🎮`);
        console.log("=".repeat(50));

        // Create game with randomized category and word
        const game = new GuessTheImposter(players);

        console.log(`\n📢 Category: ${game.category}`);
        console.log("\nPass the phone to each player to reveal their role!");
        await question("\nPress Enter to continue...\n");

        // Pass phone to each player, showing them if they're the imposter
        await game.passPhoneToEachPlayer();

        // Discussion phase
        await game.discussionPhase();

        // Voting phase
        await game.votingPhase();

        // Ask if players want to play another round
        console.log("\n" + "=".repeat(50));
        let validAnswer = false;
        while (!validAnswer) {
            const playAgain = await question("\n🎯 Play another round? (yes/no): ");
            if (playAgain.toLowerCase() === "yes" || playAgain.toLowerCase() === "y") {
                roundNumber++;
                validAnswer = true;
            } else if (playAgain.toLowerCase() === "no" || playAgain.toLowerCase() === "n") {
                console.log("\n" + "=".repeat(50));
                console.log("🏁 Thanks for playing GUESS THE IMPOSTER! 🏁");
                console.log("=".repeat(50));
                rl.close();
                return;
            } else {
                console.log("❌ Please enter 'yes' or 'no'.");
            }
        }
    }
}

// Run the game
main();
