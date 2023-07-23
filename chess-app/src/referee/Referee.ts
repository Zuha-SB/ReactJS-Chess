import { Position, PieceType, TeamType, Piece, samePosition } from "../Constants";
import { bishopMove } from "./rules/BishopRules";
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "./rules/GeneralRules";
import { knightMove } from "./rules/KnightRules";
import { pawnMove } from "./rules/PawnRules";
import { queenMove } from "./rules/QueenRules";
import { rookMove } from "./rules/RookRules";

export default class Referee {
    isEnPassantMove(initialPosition: Position, desiredPosition: Position, type: PieceType,team: TeamType, boardState: Piece[]) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if(type === PieceType.PAWN) {
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === pawnDirection) {
                const piece = boardState.find((p) => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant );
                if(piece) {
                    return true;
                }
            }
        }
        return false;
    }
    
    kingMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {   
        let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
        let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

        let passedPosition: Position = {x: initialPosition.x + (multiplierX), y: initialPosition.y + (multiplierY)};
        if(samePosition(passedPosition, desiredPosition)) {
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                return true;
            }
        }
        return false;
    }

    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
        let validMove = false;
        switch(type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KING:
                validMove = this.kingMove(initialPosition, desiredPosition, team, boardState);
                break;
        }
        return validMove;
    }
}