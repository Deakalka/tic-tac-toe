document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const toggleModeButton = document.getElementById('toggleModeButton');
    const cells = document.querySelectorAll('.cell');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let playerXMoves = [];
    let playerOMoves = [];
    let gameMode = 'twoPlayers'; // 'twoPlayers' or 'vsBot'
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer);
        
        if (currentPlayer === 'X') {
            playerXMoves.push(clickedCellIndex);
            if (playerXMoves.length > 3) {
                const oldestMove = playerXMoves.shift();
                gameState[oldestMove] = '';
                const oldestCell = document.querySelector(`.cell[data-index='${oldestMove}']`);
                oldestCell.textContent = '';
                oldestCell.classList.remove('X');
            }
        } else {
            playerOMoves.push(clickedCellIndex);
            if (playerOMoves.length > 3) {
                const oldestMove = playerOMoves.shift();
                gameState[oldestMove] = '';
                const oldestCell = document.querySelector(`.cell[data-index='${oldestMove}']`);
                oldestCell.textContent = '';
                oldestCell.classList.remove('O');
            }
        }
        
        if (checkResult()) {
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
        
        if (gameMode === 'vsBot' && currentPlayer === 'O') {
            makeBestMove();
        }
    }
    
    function makeBestMove() {
        let bestScore = -Infinity;
        let bestMove;
        
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        gameState[bestMove] = 'O';
        playerOMoves.push(bestMove);
        if (playerOMoves.length > 3) {
            const oldestMove = playerOMoves.shift();
            gameState[oldestMove] = '';
            const oldestCell = document.querySelector(`.cell[data-index='${oldestMove}']`);
            oldestCell.textContent = '';
            oldestCell.classList.remove('O');
        }
        
        const bestCell = document.querySelector(`.cell[data-index='${bestMove}']`);
        bestCell.textContent = 'O';
        bestCell.classList.add('O');
        
        if (checkResult()) {
            return;
        }
        
        currentPlayer = 'X';
        statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
    }
    
    function minimax(newGameState, depth, isMaximizing) {
        const scores = {
            'X': -1,
            'O': 1,
            'tie': 0
        };
        
        let result = evaluateState(newGameState);
        if (result !== null) {
            return scores[result];
        }
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === '') {
                    newGameState[i] = 'O';
                    let score = minimax(newGameState, depth + 1, false);
                    newGameState[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < newGameState.length; i++) {
                if (newGameState[i] === '') {
                    newGameState[i] = 'X';
                    let score = minimax(newGameState, depth + 1, true);
                    newGameState[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    function evaluateState(newGameState) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (newGameState[a] && newGameState[a] === newGameState[b] && newGameState[a] === newGameState[c]) {
                return newGameState[a];
            }
        }
        
        if (!newGameState.includes('')) {
            return 'tie';
        }
        
        return null;
    }
    
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                break;
            }
        }
        
        if (roundWon) {
            statusDisplay.textContent = `Гравець ${currentPlayer} виграв!`;
            gameActive = false;
            return true;
        }
        
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = 'Нічия!';
            gameActive = false;
            return true;
        }
        
        return false;
    }
    
    function resetGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        playerXMoves = [];
        playerOMoves = [];
        statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
    }
    
    function toggleGameMode() {
        gameMode = gameMode === 'twoPlayers' ? 'vsBot' : 'twoPlayers';
        resetGame();
        statusDisplay.textContent = `Режим гри: ${gameMode === 'twoPlayers' ? 'Два гравці' : 'Проти бота'}`;
    }
    
    let gameActive = true;
    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    toggleModeButton.addEventListener('click', toggleGameMode);
    
    statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
});