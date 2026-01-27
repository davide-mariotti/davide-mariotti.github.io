/**
 * Tic Tac Toe Logic
 * Modernized for Digital Forest Theme
 */

const boxes = document.querySelectorAll(".box");
const indicator = document.getElementById("indicator");
const resultsText = document.getElementById("results");
const playAgainBtn = document.getElementById("play-again");
const turnX = document.getElementById("turn-x");
const turnO = document.getElementById("turn-o");

let turn = "X";
let isGameOver = false;

// Initialize
function init() {
    updateTurnUI();
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove("winner");
        box.addEventListener("click", () => handleMove(box));
    });
}

function handleMove(box) {
    if (isGameOver || box.textContent !== "") return;

    box.textContent = turn;
    box.style.color = turn === "X" ? "#ffffff" : "var(--color-primary)";

    if (checkWin()) {
        isGameOver = true;
        resultsText.textContent = `${turn} VICTORIOUS!`;
        playAgainBtn.style.display = "inline-block";
        return;
    }

    if (checkDraw()) {
        isGameOver = true;
        resultsText.textContent = "STALEMATE";
        playAgainBtn.style.display = "inline-block";
        return;
    }

    changeTurn();
}

function changeTurn() {
    turn = (turn === "X") ? "O" : "X";
    updateTurnUI();
}

function updateTurnUI() {
    if (turn === "X") {
        indicator.classList.remove("o-turn");
        turnX.classList.add("active");
        turnO.classList.remove("active");
    } else {
        indicator.classList.add("o-turn");
        turnO.classList.add("active");
        turnX.classList.remove("active");
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (boxes[a].textContent &&
            boxes[a].textContent === boxes[b].textContent &&
            boxes[a].textContent === boxes[c].textContent) {

            // Mark winners
            condition.forEach(index => boxes[index].classList.add("winner"));
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return Array.from(boxes).every(box => box.textContent !== "");
}

playAgainBtn.addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    resultsText.textContent = "";
    playAgainBtn.style.display = "none";
    init();
    boxes.forEach(box => {
        box.classList.remove("winner");
        box.textContent = "";
    });
});

init();