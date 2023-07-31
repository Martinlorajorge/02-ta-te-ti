import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square"
import { TURNS, WINNER_COMBOS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";

export default App;


function App() {
	const [board, setBoard] = useState(Array(9).fill(null));

	const [turn, setTurn] = useState(TURNS.X);

	//null es que no hay ganador, false es que hay un empate
	const [winner, setWinner] = useState(null);

	const checkWinner = boardToCheck => {
		//revisa todas las combinaciones ganadoras
		//para ver si X u O ganó
		for (const combo of WINNER_COMBOS) {
			const [a, b, c] = combo;
			if (
				boardToCheck[a] &&
				boardToCheck[a] === boardToCheck[b] &&
				boardToCheck[a] === boardToCheck[c]
			) {
				return boardToCheck[a];
			}
		}
		return null;
	};

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);
	};

	const checkEndGame = (newBoard) => {
		//revisamos si no hay empate
		// si no hay espacios vacíos
		//en el tablero
		return newBoard.every((square) => square !== null)
	}

	const updateBoard = index => {
		//no actualizamos esta posicion
		//si ya tiene algo
		if (board[index] || winner) return;
		//actualizar el tablero
		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);
		//cambiar el turno
		const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
		setTurn(newTurn);
		//revisar si hay un ganador
		const newWinner = checkWinner(newBoard);
		if (newWinner) {
			confetti()
			setWinner(newWinner);
		} else if (checkEndGame(newBoard)) {
			setWinner(false); //empate
		}
		//para saber si es un empate
	};

	return (
		<main className="board">
			<h1>Ta Te Ti</h1>
			<button onClick={resetGame}>Reset del juego</button>
			<section className="game">
				{board.map((_, index) => {
					return (
						<Square key={index} index={index} updateBoard={updateBoard}>
							{board[index]}
						</Square>
					);
				})}
			</section>

			<section className="turn">
				<Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
				<Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
			</section>

			<WinnerModal resetGame={resetGame} winner={winner} />
		</main>
	);
}


