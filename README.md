
P1 = Player 1
P2 = Player 2
PVP = Player vs Player
PVC = Player vs Computer

A simple Tic Tac Toe consisting of Two modes: PVP and PVC (player versus computer) [GAME](https://cgt290.github.io/Tic-Tac-Toe/index.html)

Summary of core logics for this game are Win/Draw detection, Valid move detection, and Saved move for both (p1,p2) for later use

- For PVC mode after p1 makes a move  p2 will make a random move on all indexes (board cells) that has yet to be filled out

- Turn indicator on top to highlight the active player

- Wins between p1 and p2 are tracked

- For the 2 modes moves played by both players are tracked and saved with LocalStorage. After finishing a game user can simply is able to revist the
  last match they played by simplying clicking replay button. This will redo the moves done by both p1 and p2


  Future Features:
- Speed mode: In PVP both player will have a 2-3 seconds to make a move before losing their turn
- Storing many prev matches that user can select from to have it be replayed
- An online PVP
- A 2 other PVC bot difficulties, with one of them utilising min-max algorithm 
