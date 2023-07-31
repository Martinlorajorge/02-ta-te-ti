import { useState } from "react";
import confetti from "canvas-confetti";
import { Square } from "./components/Square"
import { TURNS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";
import { checkWinnerFrom, checkEndGame } from "./logic/board";

export default App;


function App() {
	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem('board')
		if (boardFromStorage) {
			return JSON.parse(boardFromStorage)
		}
		return Array(9).fill(null)
	});

	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem('turn')
		if (turnFromStorage) {
			return JSON.parse(turnFromStorage)
		}
		return TURNS.X
	});

	//null es que no hay ganador, false es que hay un empate
	const [winner, setWinner] = useState(null);



	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(TURNS.X);
		setWinner(null);

		window.localStorage.removeItem('board')
		window.localStorage.removeItem('turn')
	};



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
		//Guardar aquí partida
		window.localStorage.setItem('board', JSON.stringify(newBoard))
		window.localStorage.setItem('turn', newTurn)
		//revisar si hay un ganador
		const newWinner = checkWinnerFrom(newBoard);
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


