document.addEventListener("DOMContentLoaded", function() {
    let Player = 'X';
    let p1Scores = 0;
    let p2Scores = 0;
    let gameRunning = false;
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6]
    ];

    let moveHistory = []; // to store previous moves for match replay
    
    const resultsDisplay = document.getElementById("resultsDisplayed");
    let mode = 'PVP';

    function switchPlayer() {
        Player = Player === 'X' ? 'O' : 'X';
    }

    function updateCell(cell, index, player = Player) {
        gameBoard[index] = player;
        cell.textContent = player;
    }

    function cellClicks() {
        const cellsIndex = this.getAttribute("data-index");
        if (gameBoard[cellsIndex] !== '' || !gameRunning) {
            return;
        }
        updateCell(this, cellsIndex);
        moveHistory.push({ index: cellsIndex, player: Player }); // Store the moves
        const winner = Winner();

        if (winner) {
            savedMatchResult(winner); 
            if (winner === 'X') {
                p1Scores++;
            } else if (winner === 'O') {
                p2Scores++;
            }
            resultsDisplay.textContent = `${winner} wins`;
            resultsDisplay.style.display = 'block'; // Show results text
            gameRunning = false;
            turnIndicator();

        } else if (!gameBoard.includes("")) { // Handle draw scenario
            savedMatchResult("DRAW");
            resultsDisplay.textContent = "DRAW";
            resultsDisplay.style.display = 'block'; // Show results text
            gameRunning = false;

        } else {
            switchPlayer();
            turnIndicator();
        }
    }

    function startGame() {
        gameRunning = true;
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        resultsDisplay.textContent = ""; 
        
    
        document.querySelectorAll('.cell').forEach(cell => {cell.addEventListener('click', cellClicks);
            cell.textContent = '';  }); //

        turnIndicator();
    }

    function Winner() {
       for (let i = 0; i < winningConditions.length; i++) {
          const [a, b, c] = winningConditions[i];
          if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] &&
            gameBoard[b] === gameBoard[c]){
            return gameBoard[a]; // the winner
        }
    }
    return null;
}
    

    function restartButton() {
        Player = 'X';
        gameRunning = true;
        isReplaying = false; // to undo replay state
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        moveHistory = []; // clear history for new game

        document.querySelectorAll('.cell').forEach(cell => { cell.textContent = '';
            cell.removeEventListener('click', cellClicks); 
            cell.addEventListener('click', cellClicks);  });// Clear each cell
        
        resultsDisplay.textContent = ""; // Clear results display
        resultsDisplay.style.display = 'none'; // Hide results text
        turnIndicator();
        
    }

    function turnIndicator() {
        const p1Container = document.getElementById('P1');
        const p2Container = document.getElementById('P2');

        p1Container.textContent = `P1 (X): ${p1Scores}`;
        p2Container.textContent = `P2 (O): ${p2Scores}`;

        if (Player === 'X') {
            p1Container.classList.add('active');
            p2Container.classList.remove('active');
        } else {
            p2Container.classList.add('active');
            p1Container.classList.remove('active');
        }

        if(mode === 'AI' && Player === 'O' && gameRunning){
            setTimeout(AI,1000);
        }
    }

    function AI(){
        let emptyIndexs = [];
        for(let i = 0; i < gameBoard.length; i++){
            if(gameBoard[i] === ''){
                emptyIndexs.push(i);
            }
        }

        if(emptyIndexs.length > 0){
            const randomIndex = emptyIndexs[Math.floor(Math.random() * emptyIndexs.length)];
            const index = document.querySelector(`.cell[data-index = "${randomIndex}"]`);
            updateCell(index, randomIndex);
            moveHistory.push({ index: randomIndex, player: 'O' }); // Storing the AI moves

            const winner = Winner();
            if (winner) {
                savedMatchResult(winner);
                if (winner === 'X') {
                    p1Scores++;
                } else if (winner === 'O') {
                    p2Scores++;
                }
                resultsDisplay.textContent = `${winner} wins`;
                resultsDisplay.style.display = 'block'; // to show the hidden results text
                gameRunning = false;
               
            } else if (!gameBoard.includes("")) { 
                savedMatchResult("DRAW");
                resultsDisplay.textContent = "DRAW";
                resultsDisplay.style.display = 'block'; 
                gameRunning = false;
    
            } else {
                switchPlayer();
                turnIndicator();
            }
        }
    }

    function changeMode(){
        mode = mode === 'PVP' ? 'AI' : 'PVP';
        //Texts to show which mode is currently selected
        document.getElementById('modeChange').textContent = `Mode:${mode}`;
        restartButton();
    }

    function savedMatchResult(result){
        const matchData = {
            winner: result,
            date: new Date().toLocaleString(),
            moves: moveHistory
        };
       
        let history = JSON.parse(localStorage.getItem('matchHistory')) || []; 
        history.push(matchData);
        localStorage.setItem('matchHistory', JSON.stringify(history));
    }

   function replayLastGame() {
    const history = JSON.parse(localStorage.getItem('matchHistory'));
    if (!history || history.length === 0) {
        alert("No saved match to replay.");
        return;
    }

    const lastMatch = history[history.length - 1]; 
    const moves = lastMatch.moves;

    restartButton();
    gameRunning = false; // prevent user interaction
    isReplaying = true; 

    document.querySelectorAll('.cell').forEach(cell => {cell.removeEventListener('click', cellClicks); });

    let i = 0;
    function playNextMove() {
        if (i >= moves.length) {
            resultsDisplay.textContent = lastMatch.winner === 'DRAW' ? 'DRAW' : `${lastMatch.winner} wins`;
            resultsDisplay.style.display = 'block';
            return;
        }

        const move = moves[i];
        Player = move.player; 
        const cell = document.querySelector(`.cell[data-index="${move.index}"]`);
        updateCell(cell, move.index, move.player);
        turnIndicator();
        i++;
        setTimeout(playNextMove, 800); 
    }
    
    playNextMove();
}
 
    document.getElementById('replayGame').addEventListener('click', replayLastGame);
    document.getElementById('modeChange').addEventListener('click', changeMode);
    document.getElementById('restartGame').addEventListener('click', restartButton);
    startGame();
});