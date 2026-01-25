const readline = require('readline');

// ═══════════════════════════════════════════════════════════
// ANSI COLOR CODES AND UI UTILITIES
// ═══════════════════════════════════════════════════════════

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

const question = (prompt, color = 'cyan') => {
    return new Promise((resolve) => {
        const styledPrompt = `${colors[color]}${colors.bright}${prompt}${colors.reset}`;
        rl.question(styledPrompt, (answer) => {
            resolve(answer);
        });
    });
};

// UI Helper Functions
const divider = (width = 60, style = '═') => `${colors.cyan}${style.repeat(width)}${colors.reset}`;
const header = (text) => `${colors.bright}${colors.cyan}${text}${colors.reset}`;
const success = (text) => `${colors.green}✓${colors.reset} ${text}`;
const error = (text) => `${colors.red}✗${colors.reset} ${text}`;
const info = (text) => `${colors.blue}ℹ${colors.reset} ${text}`;
const highlight = (text) => `${colors.yellow}${colors.bright}${text}${colors.reset}`;

const clearScreen = () => {
    console.clear();
};

// Game categories with 25 words each
const GAME_CATEGORIES = {
    "🦁 Animals": ["Lion", "Elephant", "Penguin", "Dolphin", "Eagle", "Tiger", "Giraffe", "Zebra", "Kangaroo", "Panda",
                "Bear", "Wolf", "Fox", "Deer", "Monkey", "Parrot", "Whale", "Shark", "Snake", "Butterfly",
                "Owl", "Cheetah", "Hippopotamus", "Crocodile", "Rabbit"],

    "🍎 Fruits": ["Apple", "Banana", "Orange", "Strawberry", "Grape", "Watermelon", "Pineapple", "Mango", "Kiwi", "Blueberry",
               "Raspberry", "Peach", "Plum", "Cherry", "Lemon", "Lime", "Coconut", "Papaya", "Pomegranate", "Blackberry",
               "Tangerine", "Apricot", "Guava", "Date", "Fig"],

    "🌍 Countries": ["France", "Japan", "Brazil", "Australia", "Mexico", "Canada", "India", "Egypt", "Italy", "Germany",
                  "Spain", "Thailand", "Norway", "Sweden", "Greece", "Turkey", "Portugal", "Netherlands", "Belgium", "Austria",
                  "Switzerland", "Russia", "China", "Argentina", "South Korea"],

    "🍕 Food": ["Pizza", "Burger", "Sushi", "Taco", "Pasta", "Salad", "Sandwich", "Steak", "Chicken", "Fish",
             "Rice", "Bread", "Soup", "Curry", "Omelette", "Bacon", "Ham", "Cheese", "Butter", "Yogurt",
             "Cereal", "Candy", "Cookie", "Cake", "Donut"],

    "⚽ Sports": ["Football", "Basketball", "Tennis", "Baseball", "Hockey", "Volleyball", "Swimming", "Running", "Cycling", "Skiing",
               "Golf", "Surfing", "Wrestling", "Boxing", "Karate", "Gymnastics", "Archery", "Badminton", "Bowling", "Cricket",
               "Lacrosse", "Handball", "Rugby", "TableTennis", "Fencing"],

    "🎬 Movies": ["Avatar", "Titanic", "Inception", "Jaws", "Gladiator", "Matrix", "Shrek", "Frozen", "Lion King", "Toy Story",
               "Finding Nemo", "Avengers", "Jurassic Park", "Terminator", "Batman", "Superman", "Spiderman", "Wonder Woman", "Thor", "Iron Man",
               "Captain America", "Aquaman", "Black Panther", "Deadpool", "Joker"],

    "👔 Professions": ["Doctor", "Teacher", "Engineer", "Lawyer", "Pilot", "Nurse", "Mechanic", "Chef", "Architect", "Programmer",
                    "Artist", "Musician", "Actor", "Photographer", "Journalist", "Scientist", "Farmer", "Carpenter", "Plumber", "Electrician",
                    "Accountant", "Manager", "Police Officer", "Firefighter", "Soldier"],

    "🎨 Colors": ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White",
               "Gray", "Cyan", "Magenta", "Lime", "Indigo", "Violet", "Turquoise", "Gold", "Silver", "Beige",
               "Maroon", "Navy", "Olive", "Coral", "Crimson"],

    "💻 Technology": ["Computer", "Phone", "Laptop", "Tablet", "Robot", "Drone", "Camera", "Microphone", "Monitor", "Keyboard",
                   "Mouse", "Printer", "Scanner", "Television", "Radio", "Speaker", "Headphone", "Console", "Processor", "Battery",
                   "Server", "Router", "Modem", "Charger", "Cable"],

    "⛅ Weather": ["Sunshine", "Rain", "Snow", "Thunder", "Lightning", "Wind", "Fog", "Hail", "Tornado", "Hurricane",
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
            console.log(`  ${colors.yellow}${player}${colors.reset}: ${clue}`);
        }
    }

    castVote(voter, suspect) {
        this.votes[voter] = suspect;
    }

    determineWinner() {
        const imposterVotes = Object.values(this.votes).filter(vote => vote === this.imposter).length;
        
        if (imposterVotes > this.players.length / 2) {
            return "🎯 " + highlight("GROUP WINS!") + " The imposter has been discovered!";
        } else {
            return "🕵️  " + highlight("IMPOSTER WINS!") + " Successfully remained hidden!";
        }
    }

    getImposter() {
        return this.imposter;
    }

    clearScreen() {
        console.clear();
    }

    async passPhoneToEachPlayer() {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            clearScreen();
            
            console.log(`\n${divider()}`);
            console.log(`${header('📱 PHONE PASSED TO PLAYER')}`);
            console.log(`${divider()}\n`);
            
            console.log(`  ${colors.bright}${colors.magenta}${player}${colors.reset}`);
            console.log(`  ${colors.dim}(${i + 1}/${this.players.length})${colors.reset}\n`);

            if (player === this.imposter) {
                console.log(`${divider('·', 60)}\n`);
                console.log(`  ${highlight('🕵️  YOU ARE THE IMPOSTER!')}`);
                console.log(`${divider('·', 60)}\n`);
                console.log(`  ${colors.yellow}Category:${colors.reset} ${this.category}`);
                console.log(`  ${colors.yellow}Secret Word:${colors.reset} ${highlight(this.secretWord)}\n`);
                console.log(`  ${colors.dim}Your Mission:${colors.reset}`);
                console.log(`  • Blend in with believable clues`);
                console.log(`  • Don't reveal the exact word`);
                console.log(`  • Avoid detection at all costs\n`);
            } else {
                console.log(`${divider('·', 60)}\n`);
                console.log(`  ${success('YOU ARE NOT THE IMPOSTER')}`);
                console.log(`${divider('·', 60)}\n`);
                console.log(`  ${colors.yellow}Category:${colors.reset} ${this.category}`);
                console.log(`  ${colors.yellow}Secret Word:${colors.reset} ${highlight(this.secretWord)}\n`);
                console.log(`  ${colors.dim}Your Mission:${colors.reset}`);
                console.log(`  • Give clever clues about the word`);
                console.log(`  • Identify the imposter`);
                console.log(`  • Work with other players to expose them\n`);
            }

            console.log(`${divider()}`);
            await question(`\n  ${colors.dim}Press Enter to continue...${colors.reset} `);
        }
    }

    async discussionPhase() {
        clearScreen();
        console.log(`\n${divider()}`);
        console.log(`${header('💬 DISCUSSION PHASE')}`);
        console.log(`${divider()}\n`);
        
        console.log(`  ${colors.bright}${colors.cyan}All players know their roles. Time to talk!${colors.reset}\n`);
        console.log(`  ${highlight('Guidelines:')}`);
        console.log(`  • Give one-word clues about the secret word`);
        console.log(`  • Try to identify who the imposter is`);
        console.log(`  • The imposter must blend in with their clues`);
        console.log(`  • Don't say the exact word!\n`);
        
        console.log(`  ${colors.yellow}Take as much time as you need to discuss.${colors.reset}`);
        console.log(`  ${colors.dim}Pay attention to each player's clues and behavior...${colors.reset}\n`);
        
        console.log(`${divider()}`);
        await question(`\n  ${colors.dim}Press Enter when ready to vote...${colors.reset} `);
    }

    async votingPhase() {
        clearScreen();
        console.log(`\n${divider()}`);
        console.log(`${header('🗳️  VOTING PHASE')}`);
        console.log(`${divider()}\n`);
        
        console.log(`  ${colors.cyan}${colors.bright}Who is the imposter?${colors.reset}\n`);
        console.log(`  ${colors.dim}Available players:${colors.reset}`);
        
        this.players.forEach((p, idx) => {
            console.log(`    ${highlight(`[${idx + 1}]`)} ${p}`);
        });
        console.log();

        for (const player of this.players) {
            let validVote = false;
            while (!validVote) {
                const vote = await question(`\n  ${player}, your vote: `);
                if (this.players.includes(vote) && vote !== player) {
                    this.castVote(player, vote);
                    console.log(`  ${success(`${player} voted for ${vote}`)}`);
                    validVote = true;
                } else if (vote === player) {
                    console.log(`  ${error("You can't vote for yourself!")}`);
                } else {
                    console.log(`  ${error("Invalid player name. Try again.")}`);
                }
            }
        }

        await this.showResults();
    }

    async showResults() {
        clearScreen();
        console.log(`\n${divider()}`);
        console.log(`${header('📊 VOTING RESULTS')}`);
        console.log(`${divider()}\n`);
        
        console.log(`  ${colors.yellow}${colors.bright}Vote Summary:${colors.reset}\n`);
        
        for (const [voter, suspect] of Object.entries(this.votes)) {
            console.log(`    ${highlight(voter)} → ${suspect}`);
        }

        console.log(`\n${divider('·', 60)}\n`);
        console.log(`  ${this.determineWinner()}`);
        console.log(`\n${divider('·', 60)}\n`);
        
        console.log(`  ${highlight('The Answer:')} ${highlight(this.secretWord)}`);
        console.log(`  ${highlight('The Imposter:')} ${this.getImposter()}\n`);
        
        console.log(`${divider()}`);
        await question(`\n  ${colors.dim}Press Enter to continue...${colors.reset} `);
    }
}

// Main game function
async function main() {
    clearScreen();
    console.log(`
${divider('═', 60)}
${header('╔═══════════════════════════════════════════════════════╗')}
${header('║    🎭  GUESS THE IMPOSTER  🎭                         ║')}
${header('║          A Game of Deception & Detection               ║')}
${header('╚═══════════════════════════════════════════════════════╝')}
${divider('═', 60)}
    `);
    
    console.log(`\n  ${info('Welcome to Guess The Imposter!')}\n`);
    console.log(`  ${colors.dim}How to play:${colors.reset}`);
    console.log(`  • One player is randomly chosen as the imposter`);
    console.log(`  • Everyone sees the category but only after passing the phone`);
    console.log(`  • Each player gets to see the secret word`);
    console.log(`  • The imposter doesn't actually know the secret word!`);
    console.log(`  • Give one-word clues and vote who you think is the imposter\n`);
    
    console.log(`${divider()}`);
    console.log(`\n  ${colors.bright}${colors.cyan}Let's get started!${colors.reset}\n`);
    
    // Get player names
    console.log(`  ${colors.yellow}Enter player names (minimum 2 players)${colors.reset}\n`);
    
    const players = [];
    while (true) {
        const name = (await question(`  Player ${players.length + 1}: `)).trim();
        
        if (name.toLowerCase() === 'done') {
            if (players.length >= 2) {
                break;
            } else {
                console.log(`  ${error("You need at least 2 players!")}`);
            }
        } else if (name) {
            if (players.includes(name)) {
                console.log(`  ${error(`${name} is already in the game!`)}`);
            } else {
                players.push(name);
                console.log(`  ${success(`${name} joined`)}`);
            }
        }
    }

    clearScreen();
    console.log(`\n${divider()}`);
    console.log(`${header('🎮 GAME STARTED')}`);
    console.log(`${divider()}\n`);
    
    console.log(`  ${success(`Game starting with ${players.length} players`)}\n`);
    
    players.forEach((p, idx) => {
        console.log(`    ${highlight(`[${idx + 1}]`)} ${p}`);
    });
    
    console.log(`\n${divider()}`);
    
    let roundNumber = 1;

    while (true) {
        await question(`\n  ${colors.dim}Press Enter to start Round ${roundNumber}...${colors.reset} `);
        
        clearScreen();
        console.log(`\n${divider()}`);
        console.log(`${header(`🎮 ROUND ${roundNumber}`)}`);
        console.log(`${divider()}\n`);

        const game = new GuessTheImposter(players);

        console.log(`  ${colors.yellow}${colors.bright}Category:${colors.reset} ${game.category}\n`);
        console.log(`  ${colors.dim}The phone will be passed to each player.${colors.reset}`);
        console.log(`  ${colors.dim}Only reveal your role to yourself!${colors.reset}\n`);
        
        console.log(`${divider()}`);
        await question(`\n  ${colors.dim}Press Enter to pass the phone...${colors.reset} `);

        // Game phases
        await game.passPhoneToEachPlayer();
        await game.discussionPhase();
        await game.votingPhase();

        // Ask for next round
        clearScreen();
        console.log(`\n${divider()}`);
        console.log(`${header('🎯 ROUND COMPLETE')}`);
        console.log(`${divider()}\n`);

        let validAnswer = false;
        while (!validAnswer) {
            const playAgain = await question(`  Play another round? ${highlight('[yes/no]')}: `);
            
            if (['yes', 'y'].includes(playAgain.toLowerCase())) {
                roundNumber++;
                validAnswer = true;
            } else if (['no', 'n'].includes(playAgain.toLowerCase())) {
                clearScreen();
                console.log(`\n${divider()}`);
                console.log(`${header('🏁 THANKS FOR PLAYING!')}`);
                console.log(`${divider()}\n`);
                console.log(`  ${colors.bright}${colors.magenta}Guess the Imposter${colors.reset}`);
                console.log(`  ${colors.dim}Made for ultimate party fun!${colors.reset}\n`);
                console.log(`${divider()}\n`);
                rl.close();
                process.exit(0);
            } else {
                console.log(`  ${error("Please enter 'yes' or 'no'.")}`);
            }
        }
    }
}

// Run the game
main().catch((err) => {
    console.error(err);
    rl.close();
});
