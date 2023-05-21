
const prompt = require("prompt-sync")();

//Game Size
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

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines); //string to float

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, enter again.");
        }
        else {
            return numberOfLines;
        }
    }

}

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

//Transpose Matrix
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

let balance = deposit();
const numberOfLines = getNumberOfLines();
const betAmount = getBet(balance, numberOfLines);
const reels = spin();
const rows = transpose(reels);
console.log(reels);
console.log(rows);