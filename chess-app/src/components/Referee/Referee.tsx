import { useEffect, useRef, useState } from "react";
import { PieceType, TeamType, initialBoardState } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { getPossiblePawnMoves, getPossibleKnightMoves, getPossibleBishopMoves, getPossibleRookMoves, getPossibleQueenMoves, getPossibleKingMoves, bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../rules";
import { Piece, Position } from "../../models";

export default function Referee() {

    const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        updatePossibleMoves();
    }, [])

    function updatePossibleMoves() {
        setPieces((currentPieces) => {
            return currentPieces.map(p => {
                p.possibleMoves = getValidMoves(p, currentPieces);
                return p;
            });
        });
    }

    function playMove(playedPiece: Piece, destination: Position) {
        const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

        if(enPassantMove) {
            const updatedPieces = pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    piece.enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    results.push(piece);
                } else if(!(piece.samePosition(new Position(destination.x, destination.y - pawnDirection)))) {
                    if(piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])
            updatePossibleMoves();
            setPieces(updatedPieces);
        } else if(validMove) {
            //Updates the piece position
            //And if a piece is attacked, removes it
            const updatedPieces = pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    //SPECIAL MOVE
                    piece.enPassant = Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;

                    let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;
                    if(destination.y === promotionRow && piece.type === PieceType.PAWN) {
                        modalRef.current?.classList.remove("hidden");
                        setPromotionPawn(piece);
                    }

                    results.push(piece);
                } else if(!(piece.samePosition(destination))) {
                    if(piece.type === PieceType.PAWN) {
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            updatePossibleMoves();
            setPieces(updatedPieces);
        } else {
            return false;
        }
        return true;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType,team: TeamType) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN) {
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = pieces.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant );
                if(piece) {
                    return true;
                }
            }
        }
        return false;
    }

    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch(type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, pieces);
                break;
        }
        return validMove;
    }

    function getValidMoves(piece: Piece, initialBoardState: Piece[]) : Position[] {
        switch(piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, pieces);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, pieces);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, pieces);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, pieces);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, pieces);
            case PieceType.KING:
                return getPossibleKingMoves(piece, pieces);
            default:
                return [];
        }
    }

    function promotePawn(pieceType: PieceType) {
        if(promotionPawn === undefined) {
            return;
        }

        const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.samePiecePosition(promotionPawn)) {
                piece.type = pieceType;
                const teamType = (piece.team === TeamType.OUR) ? "w" : "b";
                let image = "";
                switch(pieceType) {
                    case PieceType.KNIGHT:
                        image = "knight";
                        break;
                    case PieceType.BISHOP:
                        image = "bishop";
                        break;
                    case PieceType.ROOK:
                        image = "rook";
                        break;
                    case PieceType.QUEEN:
                        image = "queen";
                        break;
                }
                piece.image = `./chess-pieces/${image}_${teamType}.png`;
            }
            results.push(piece);

            return results;
        }, [] as Piece[])
        updatePossibleMoves();
        setPieces(updatedPieces);

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }

    return (
    <>
         <div id="pawn-promotion-modal" className='hidden' ref={modalRef}>
            <div className='modal-body'>
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`./chess-pieces/knight_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`./chess-pieces/bishop_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`./chess-pieces/rook_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`./chess-pieces/queen_${promotionTeamType()}.png`}/>
            </div>
        </div>
        <Chessboard playMove={playMove} pieces={pieces}/>
    </>
    )
}