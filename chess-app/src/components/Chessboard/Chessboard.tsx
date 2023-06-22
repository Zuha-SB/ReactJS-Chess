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

for(let i = 0; i < files.length; i++) {
    pieces.push({ piece: "chess-pieces/pawn_b.png", x: i, y: 6 })
}

for(let i = 0; i < files.length; i++) {
    pieces.push({ piece: "chess-pieces/pawn_w.png", x: i, y: 1 })
}

pieces.push({ piece: "chess-pieces/rook_b.png", x: 0, y: 7})
pieces.push({ piece: "chess-pieces/rook_b.png", x: 7, y: 7})
pieces.push({ piece: "chess-pieces/knight_b.png", x: 1, y: 7})
pieces.push({ piece: "chess-pieces/knight_b.png", x: 6, y: 7})
pieces.push({ piece: "chess-pieces/bishop_b.png", x: 2, y: 7})
pieces.push({ piece: "chess-pieces/bishop_b.png", x: 5, y: 7})
pieces.push({ piece: "chess-pieces/queen_b.png", x: 3, y: 7})
pieces.push({ piece: "chess-pieces/king_b.png", x: 4, y: 7})

pieces.push({ piece: "chess-pieces/rook_w.png", x: 0, y: 0})
pieces.push({ piece: "chess-pieces/rook_w.png", x: 7, y: 0})
pieces.push({ piece: "chess-pieces/knight_w.png", x: 1, y: 0})
pieces.push({ piece: "chess-pieces/knight_w.png", x: 6, y: 0})
pieces.push({ piece: "chess-pieces/bishop_w.png", x: 2, y: 0})
pieces.push({ piece: "chess-pieces/bishop_w.png", x: 5, y: 0})
pieces.push({ piece: "chess-pieces/queen_w.png", x: 3, y: 0})
pieces.push({ piece: "chess-pieces/king_w.png", x: 4, y: 0})

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

            board.push(<Tile piece={piece} number={sum}/>);
        }
    }
    return <div id="chessboard">{board}</div>
}