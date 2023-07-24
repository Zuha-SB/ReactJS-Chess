import { TeamType } from "../Constants";
import { Position, Piece } from "../models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    const specialRow = (team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

    //Movement logic
    if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection) {
        if(!tileIsOccupied(desiredPosition, boardState) && !tileIsOccupied(new Position(desiredPosition.x, desiredPosition.y - pawnDirection), boardState)) {
            return true;
        }
    } else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
        if(!tileIsOccupied(desiredPosition, boardState)) {
            return true;
        }
    }

    //Attack logic
    else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        //Attack to the left
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
            return true;
        }
    } else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
        //Attack to the right
        if(tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
            return true;
        }
    }
    return false;
}

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    const specialRow = (pawn.team === TeamType.OUR) ? 1 : 6;
    const pawnDirection = (pawn.team === TeamType.OUR) ? 1 : -1;

    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
    const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
    const rightPosition = new Position(pawn.position.x + 1, pawn. position.y);

    if(!tileIsOccupied(normalMove, boardState)) {
        possibleMoves.push(normalMove);
        if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
            possibleMoves.push(specialMove);
        }
    }

    if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
        possibleMoves.push(upperLeftAttack);
    } else if(!tileIsOccupied(upperLeftAttack, boardState)) {
        const leftPiece = boardState.find(p => p.samePosition(leftPosition));
        if(leftPiece != null && leftPiece.enPassant) {
            possibleMoves.push(upperLeftAttack);
        }
    }

    if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
        possibleMoves.push(upperRightAttack);
    } else if(!tileIsOccupied(upperRightAttack, boardState)) {
        const rightPiece = boardState.find(p => p.samePosition(rightPosition));
        if(rightPiece != null && rightPiece.enPassant) {
            possibleMoves.push(upperRightAttack);
        }
    }

    return possibleMoves;
}
