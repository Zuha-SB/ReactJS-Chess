import { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import { RANKS, FILES, GRID_SIZE, Piece, Position, samePosition } from '../../Constants';

interface Props {
    playMove: (piece: Piece, destination: Position) => boolean;
    pieces: Piece[];
}

export default function Chessboard({playMove, pieces} : Props) {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
    const chessboardRef = useRef<HTMLDivElement>(null);

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({x: grabX, y: grabY});
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            activePiece.style.position = "absolute";

            if(x < minX) {
                activePiece.style.left = `${minX}px`;
            } else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if(y < minY) {
                activePiece.style.top = `${minY}px`;
            } else if (y > maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }

    function dropPiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

            const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));

            if(currentPiece) {
                var success = playMove(currentPiece, {x, y});
                if(!success) {
                    //Resets the piece position
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
            setActivePiece(null);
        }
    }

    let board = [];
    for(let j = RANKS.length-1; j >= 0; j--) {
        for(let i = 0; i < FILES.length; i++) {
            const sum = j + i;
            const pieceID = pieces.find(p => samePosition(p.position, { x: i, y: j }));
            let piece = pieceID ? pieceID.piece : undefined;

            // Use this line instead if you want possible moves dots to remain after letting go of the piece: 
            // let currentPiece = pieces.find(p => samePosition(p.position, grabPosition));
            let currentPiece = activePiece != null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
            let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, {x: i, y: j})) : false;

            board.push(<Tile key={`${j},${i}`} piece={piece} number={sum} highlight={highlight}/>);
        }
    }
    return (
        <>
            <div 
                onMouseMove={(e) => movePiece(e)} 
                onMouseDown={(e) => grabPiece(e)} 
                onMouseUp={(e) => dropPiece(e)}
                id="chessboard"
                ref={chessboardRef}
            >
                {board}
            </div>
        </>
    );
}
