import { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from '../../referee/Referee';
import { RANKS, FILES, GRID_SIZE, Piece, PieceType, TeamType, initialBoardState, Position, samePosition } from '../../Constants';

export default function Chessboard() {
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

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
                const validMove = referee.isValidMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces);

                const isEnPassantMove = referee.isEnPassantMove(grabPosition, {x, y}, currentPiece.type, currentPiece.team, pieces);

                const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

                if(isEnPassantMove) {
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if(!(samePosition(piece.position, { x, y: y - pawnDirection }))) {
                            if(piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[])

                    setPieces(updatedPieces);
                } else if(validMove) {
                    //Updates the piece position
                    //And if a piece is attacked, removes it
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(piece.position, grabPosition)) {
                            //SPECIAL MOVE
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            piece.position.x = x;
                            piece.position.y = y;

                            let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;
                            if(y === promotionRow) {
                                setPromotionPawn(currentPiece);
                            }

                            results.push(piece);
                        } else if(!(samePosition(piece.position, { x, y }))) {
                            if(piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);

                    setPieces(updatedPieces);
                } else {
                    //Resets the piece position
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
            setActivePiece(null);
        }
    }

    function promotePawn(pieceType: PieceType) {
        //promote
    }

    let board = [];
    for(let j = RANKS.length-1; j >= 0; j--) {
        for(let i = 0; i < FILES.length; i++) {
            const sum = j + i;
            const pieceID = pieces.find(p => samePosition(p.position, { x: i, y: j }));
            let piece = pieceID ? pieceID.piece : undefined;
            board.push(<Tile key={`${j},${i}`} piece={piece} number={sum}/>);
        }
    }
    return (
        <>
            <div id="pawn-promotion-modal">
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src="./chess-pieces/knight_w.png"/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src="/chess-pieces/bishop_w.png"/>
                <img onClick={() => promotePawn(PieceType.ROOK)} src="/chess-pieces/rook_w.png"/>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src="/chess-pieces/queen_w.png"/>
            </div>
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
