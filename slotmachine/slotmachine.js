
const prompt = require("prompt-sync")(); //library for promp sync

//Game Size (3x3)
const ROWS = 3;
const COLS = 3;

//Symbol Count
const SYMBOLS_COUNT = {
    7: 2,
    A: 4,
    B: 6,
    C: 8
}

//Symbol Value
const SYMBOLS_VALUE = {
    7: 7,
    A: 3,
    B: 2,
    C: 1
}

//Deposit function
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount); //string to float

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid amount, enter again.");
        }
        else {
            return numberDepositAmount;
        }
    }
};

//Number of lines to bet on function
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseInt(lines); //string to float

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, enter again.");
        }
        else {
            return numberOfLines;
        }
    }

}

//Bet amount function
const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter bet amount per line: ");
        const numberBetAmount = parseFloat(betAmount); //string to float

        if (isNaN(numberBetAmount) || numberBetAmount <= 0 || numberBetAmount > balance / lines) {
            console.log("Invalid bet amount, enter again.");
        }
        else {
            return numberBetAmount;
        }
    }
}

//Spin reel and get output function
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

//Transpose Matrix (flip rows and columns)
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

//Print rows of transposed matrix
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

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

const game = () => {
    let balance = deposit();

    while (true) {
        console.log(`Your balance is $${balance}.`);
        const numberOfLines = getNumberOfLines();
        const betAmount = getBet(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, betAmount, numberOfLines);
        balance += winnings;
        console.log(`You won, $${winnings}.`);

        if (balance <= 0) {
            console.log("Out of money!");
            break;
        }

        const playAgain = prompt("Do you wish to play again (y/n) ?")

        if (playAgain != "y")
        break;
     }

}

game();