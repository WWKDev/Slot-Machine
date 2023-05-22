
const prompt = require("prompt-sync")(); //library for promp sync

//Game Config
const ROWS = 3; //Rows in game grid
const COLS = 3; //Columns in game grid 
const SYMBOLS_COUNT = {7: 2, A: 4, B: 6, C: 8}; //Count of each symbol
const SYMBOLS_VALUE = {7: 7, A: 3, B: 2, C: 1}; //Value of each symbol

//Validate deposit and return deposit amount
const getDepositAmount = () => {
    while (true) {
        const depositAmount = prompt("Enter deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        //Check if deposit amount if valid and if its more than 0.
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid amount, enter again.");
        }
        else {
            return numberDepositAmount;
        }
    }
};

//Validate and return no. of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseInt(lines); //string to float

        //Check if number of lines is a valid number and within range.
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, enter again.");
        }
        else {
            return numberOfLines;
        }
    }

}

//Validate and return bet amount
const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter bet amount per line: ");
        const numberBetAmount = parseFloat(betAmount); //string to float

        //Check if bet amount is a valid number, more than 0 and within available balance
        if (isNaN(numberBetAmount) || numberBetAmount <= 0 || numberBetAmount > balance / lines) {
            console.log("Invalid bet amount, enter again.");
        }
        else {
            return numberBetAmount;
        }
    }
}

//Spin reel and generate random symbols for the reel
const spin = () => {
    const symbols = [];
    for (const [symbol, count]of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j <ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}

//Transpose Matrix (turn columns into rows)
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j <COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }
    return rows
}

//Print rows of game grid (transposed matrix)
const printRows = (rows) => {
    for (const row of rows) {
        console.log(row.join(' | ')); //use Array.join()
    }
}
//Winnings multiplier
const getWinnings = (rows, betAmount, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        
        if (allSame) {
            winnings += betAmount * SYMBOLS_VALUE[symbols[0]]
        }
    }
    return winnings;
}

//Check if player wish to continue
const askToPlayAgain = () => {
    while (true) {
        const playAgain = prompt("Do you wish to play again (y/n)?").toLowerCase();
        if(playAgain === 'y' || playAgain === "yes") {
        return true;
        }
        else if (playAgain === 'n' || playAgain === "no") {
            return false;
        }
        else {
            console.log("Please enter 'y' or 'n'.");
        }
    }
}

//Main game loop, runs till $ == 0 or player quits
const gameLoop = (balance) => {
    while (balance > 0) {
        console.log(`Your balance is $${balance}.`);
        const numberOfLines = getNumberOfLines();
        const betAmount = getBet(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, betAmount, numberOfLines);
        balance += winnings;

        if (winnings > 0) {
            console.log(`You won, $${winnings}.`);
        }
        else {
            console.log(`Too bad, you lost $${betAmount * numberOfLines}.`); //How much the player lost that round
        }

        if (balance <= 0) {
            console.log("Out of money!");
            break;
        }

        if (!askToPlayAgain()) {
            break;
        }
     }
    }

//Initialize game
const startGame = () => {
    let balance = getDepositAmount();
    gameLoop(balance);
}

startGame();