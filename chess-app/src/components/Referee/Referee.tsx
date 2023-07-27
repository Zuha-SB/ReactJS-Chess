import { useEffect, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { bishopMove, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../rules";
import { Piece, Position } from "../../models";
import { TeamType, PieceType } from "../../Types";
import { Pawn } from "../../models/Pawn";
import { Board } from "../../models/Board";

export default function Referee() {

    const [board, setBoard] = useState<Board>(initialBoard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        board.calculateAllMoves();
    }, [])

    function playMove(playedPiece: Piece, destination: Position): boolean {
        if(playedPiece.possibleMoves === undefined) return false;

        // Prevent the inactive team from playing
        if(playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1) return false;
        if(playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0) return false;

        let playedMoveIsValid = false;

        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if(!validMove) return false;

        const enPassantMove = isEnPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);

        //playMove modifies the board thus we need to call setBoard
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove, validMove, playedPiece, destination);
            return clonedBoard;
        })

        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;
        if(destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }
        
        return playedMoveIsValid;
    }

    function isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType,team: TeamType) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN) {
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = board.pieces.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.isPawn && (p as Pawn).enPassant );
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
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
                break;
        }
        return validMove;
    }

    function promotePawn(pieceType: PieceType) {
        if(promotionPawn === undefined) {
            return;
        }

        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = board.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType, piece.team, true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])
            clonedBoard.calculateAllMoves();
            return clonedBoard;
        })
        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
    }

    return (
    <>
        <p style={{color: "white", fontSize: "24px"}}>{board.totalTurns}</p>
        <div className='modal hidden' ref={modalRef}>
            <div className='modal-body'>
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`./chess-pieces/knight_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`./chess-pieces/bishop_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`./chess-pieces/rook_${promotionTeamType()}.png`}/>
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`./chess-pieces/queen_${promotionTeamType()}.png`}/>
            </div>
        </div>
        <div className="modal" ref={checkmateModalRef}>
            <div className="modal-body">
                <div className="checkmate-body">
                    <span>The winning team is !</span>
                    <button>Play again</button>
                </div>
            </div>
        </div>
        <Chessboard playMove={playMove} pieces={board.pieces}/>
    </>
    )
}