import { act } from '@testing-library/react';
import Tile from '../Tile/Tile'
import './Chessboard.css';

const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
    piece: string
    x: number
    y: number
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
    const type = (p === 0) ? "b" : "w";
    const y = (p === 0) ? 7 : 0;

    pieces.push({ piece: `chess-pieces/rook_${type}.png`, x: 0, y })
    pieces.push({ piece: `chess-pieces/rook_${type}.png`, x: 7, y })
    pieces.push({ piece: `chess-pieces/knight_${type}.png`, x: 1, y })
    pieces.push({ piece: `chess-pieces/knight_${type}.png`, x: 6, y })
    pieces.push({ piece: `chess-pieces/bishop_${type}.png`, x: 2, y })
    pieces.push({ piece: `chess-pieces/bishop_${type}.png`, x: 5, y })
    pieces.push({ piece: `chess-pieces/queen_${type}.png`, x: 3, y })
    pieces.push({ piece: `chess-pieces/king_${type}.png`, x: 4, y })
}

for(let i = 0; i < files.length; i++) {
    pieces.push({ piece: "chess-pieces/pawn_b.png", x: i, y: 6 })
}

for(let i = 0; i < files.length; i++) {
    pieces.push({ piece: "chess-pieces/pawn_w.png", x: i, y: 1 })
}

let activePiece: HTMLElement | null = null;

function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    if(element.classList.contains("chess-piece")) {
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        activePiece = element;
    }
}

function movePiece(e: React.MouseEvent) {
    if(activePiece) {
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        activePiece.style.position = "absolute";
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
    }
}

function dropPiece(e: React.MouseEvent) {
    if(activePiece) {
        activePiece = null;
    }
}

export default function Chessboard() {
    let board = [];
    for(let j = ranks.length-1; j >= 0; j--) {
        for(let i = 0; i < files.length; i++) {
            const sum = j + i;
            let piece = undefined;
            pieces.forEach(p => {
                if(p.x === i && p.y === j) {
                    piece = p.piece;
                }
            })
            board.push(<Tile key={`${j},${i}`} piece={piece} number={sum}/>);
        }
    }
    return (
        <div 
            onMouseMove={(e) => movePiece(e)} 
            onMouseDown={(e) => grabPiece(e)} 
            onMouseUp={(e) => dropPiece(e)}
            id="chessboard"
        >
            {board}
        </div>
    );
}