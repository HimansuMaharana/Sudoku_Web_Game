const grid = document.getElementById('sudoku-grid');
const solveButton = document.getElementById('solve-button');
const resetButton = document.getElementById('reset-button');
let selectedCell = null;
let sudokuBoard = [];
let initialBoard = [];

function generateSudoku() {
    const board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    return board;
}

function createGrid() {
    sudokuBoard = generateSudoku();
    initialBoard = sudokuBoard.map(row => row.slice());

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('sudoku-cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (sudokuBoard[row][col] !== 0) {
                cell.textContent = sudokuBoard[row][col];
                cell.classList.add('given');
            }

            cell.addEventListener('click', () => handleCellClick(cell));

            grid.appendChild(cell);
        }
    }
}

function handleCellClick(cell) {
    if (!cell.classList.contains('given')) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = cell;
        cell.classList.add('selected');
    }
}

function handleKeyPress(event) {
    if (selectedCell) {
        const key = event.key;
        if (key >= '1' && key <= '9') {
            const row = parseInt(selectedCell.dataset.row);
            const col = parseInt(selectedCell.dataset.col);
            sudokuBoard[row][col] = parseInt(key);
            selectedCell.textContent = key;
            validateBoard();
        } else if (key === 'Backspace' || key === 'Delete') {
            const row = parseInt(selectedCell.dataset.row);
            const col = parseInt(selectedCell.dataset.col);
            sudokuBoard[row][col] = 0;
            selectedCell.textContent = '';
            validateBoard();
        }
    }
}

function validateBoard() {
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => cell.classList.remove('error'));

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuBoard[row][col] !== 0) {
                if (!isValidMove(row, col, sudokuBoard[row][col])) {
                    const errorCell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
                    errorCell.classList.add('error');
                }
            }
        }
    }
}

function isValidMove(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[row][i] === num && i !== col) return false;
        if (sudokuBoard[i][col] === num && i !== row) return false;
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuBoard[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) return false;
        }
    }
    return true;
}

function getHint() {
    let emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuBoard[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) {
        alert("No more hints available!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(row, col, num)) {
            sudokuBoard[row][col] = num;
            updateGrid();
            return;
        }
    }
}

function updateGrid() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
            cell.textContent = sudokuBoard[row][col] !== 0 ? sudokuBoard[row][col] : '';
        }
    }
    validateBoard();
}

function resetBoard() {
    sudokuBoard = initialBoard.map(row => row.slice());
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
            if (initialBoard[row][col] === 0) {
                cell.textContent = '';
            } else {
                cell.textContent = initialBoard[row][col];
            }
            cell.classList.remove('error');
        }
    }
}

createGrid();

solveButton.addEventListener('click', getHint);
resetButton.addEventListener('click', resetBoard);
document.addEventListener('keydown', handleKeyPress);