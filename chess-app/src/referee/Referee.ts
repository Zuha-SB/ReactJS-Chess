import { Position, PieceType, TeamType, Piece, samePosition } from "../Constants";
import { bishopMove } from "./rules/BishopRules";
import { tileIsOccupied, tileIsOccupiedByOpponent, tileIsEmptyOrOccupiedByOpponent } from "./rules/GeneralRules";
import { knightMove } from "./rules/KnightRules";
import { pawnMove } from "./rules/PawnRules";

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
    
    rookMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        if(initialPosition.x === desiredPosition.x) {
            for(let i = 1; i < 8; i++) {
                let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
                let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i*multiplier)};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }
        if(initialPosition.y === desiredPosition.y) {
            for(let i = 1; i < 8; i++) {
                let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;
                let passedPosition: Position = {x: initialPosition.x + (i*multiplier), y: initialPosition.y};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }   
        return false;
    }
    
    queenMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        for(let i = 1; i < 8; i++) {
            let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
            let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

            let passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};
            if(samePosition(passedPosition, desiredPosition)) {
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if(tileIsOccupied(passedPosition, boardState)) {
                    break;
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
                validMove = this.rookMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.QUEEN:
                validMove = this.queenMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KING:
                validMove = this.kingMove(initialPosition, desiredPosition, team, boardState);
                break;
        }
        return validMove;
    }
}