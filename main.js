document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('gameBoard');
  const statusDisplay = document.getElementById('status');
  const resetButton = document.getElementById('resetButton');
  const cells = document.querySelectorAll('.cell');
  
  let currentPlayer = 'X';
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let playerXMoves = [];
  let playerOMoves = [];
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
      
      checkResult();
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
          return;
      }
      
      const roundDraw = !gameState.includes('');
      if (roundDraw) {
          statusDisplay.textContent = 'Нічия!';
          gameActive = false;
          return;
      }
      
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
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
  
  let gameActive = true;
  
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);
  
  statusDisplay.textContent = `Хід гравця ${currentPlayer}`;
});
