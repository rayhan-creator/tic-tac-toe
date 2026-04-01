import { useState } from 'react';

function Square({ value, onSquareClick }) {
  const colorClass = value === 'X' ? 'square-x' : value === 'O' ? 'square-o' : '';
  return (
    <button className={`square ${colorClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerData = calculateWinner(squares);
  const winner = winnerData ? winnerData.player : null;
  const winningLine = winnerData ? winnerData.line : [];
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();

    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  let status = '';
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(sq => sq !== null)) {
    status = "Seri!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Square 
            key={i}
            value={squares[i]} 
            onSquareClick={() => handleClick(i)} 
            isWinnerSquare={winningLine.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((squares, move) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }

  return false;
}