const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    '🍒': 4,
    '🍋': 4,
    '🍊': 4,
    '🍉': 3,
    '🍇': 3,
    '🍀': 2
};
const SYMBOL_VALUES = {
    '🍒': 2,
    '🍋': 3,
    '🍊': 4,
    '🍉': 5,
    '🍇': 10,
    '🍀': 20
};

const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const balanceDisplay = document.getElementById("balanceDisplay");
const betInput = document.getElementById("betInput");
const linesInput = document.getElementById("linesInput");
const controls = document.getElementById("controls");

let balance = 100;

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            reels[i].push(reelSymbols[randomIndex]);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const displayRows = (rows) => {
    return rows.map(row => 
        row.map(symbol => `<span class="reel">${symbol}</span>`).join(" ")
    ).join("<br>");
};

const updateBalanceUI = () => {
    balanceDisplay.textContent = balance;
};

spinButton.addEventListener("click", () => {
    // Reset animation by removing and re-adding the class
    resultDiv.style.animation = "none";
    void resultDiv.offsetWidth; // Trigger reflow to restart animation
    resultDiv.style.animation = "glitch .3s linear";

    const bet = parseInt(betInput.value);
    const lines = parseInt(linesInput.value);

    if (isNaN(bet)) {
        resultDiv.innerHTML = `<p>Invalid bet amount!</p>`;
        return;
    }
    if (isNaN(lines) || lines < 1 || lines > 3) {
        resultDiv.innerHTML = `<p>Invalid number of lines (1-3 only)!</p>`;
        return;
    }

    if (balance < bet * lines) {
        resultDiv.innerHTML = `<p>Insufficient balance!</p>`;
        return;
    }

    balance -= bet * lines;
    const reels = spin();
    const rows = transpose(reels);
    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    resultDiv.innerHTML = `
        <p><strong>Result:</strong><br>${displayRows(rows)}</p>
        <p><strong>You won:</strong> $${winnings}</p>
    `;
    updateBalanceUI();

    if (balance <= lines * bet) {

        resultDiv.innerHTML += `<p><strong>Game Over!</strong></p>`;
        resultDiv.innerHTML += `<p>Insufficient balance to continue playing.</p>`;
        spinButton.disabled = true;
        betInput.disabled = true;
        linesInput.disabled = true;
        balanceDisplay.textContent = 'Game Over!';
        spinButton.innerText = 'Play Again';
        spinButton.onclick = () => {
            location.reload();
        };
        return;
    }
    else {
        spinButton.disabled = false;
        betInput.disabled = false;
        linesInput.disabled = false;
        spinButton.innerText = 'Spin';
    }
    if (balance >= 80) {
        balanceDisplay.textContent = `${balance}`;
        controls.style.backgroundColor = "green";
    }
    else if (balance >= 50) {
        balanceDisplay.textContent = `${balance}`;
        controls.style.backgroundColor = "yellow";
        controls.style.color = "black";
    }
     else if (balance >= 10){
        balanceDisplay.textContent = `${balance}`;
        controls.style.backgroundColor = "orange";
        controls.style.color = "black";
    }
    else {
        balanceDisplay.textContent = `${balance}`;
        controls.style.backgroundColor = "red";
        controls.style.color = "white";
    }
});

// Initialize balance display
updateBalanceUI();