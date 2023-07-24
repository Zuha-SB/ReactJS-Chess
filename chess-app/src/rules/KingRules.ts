import { TeamType } from "../Constants";
import { Position, Piece } from "../models";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {   
    let multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
    let multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

    let passedPosition = new Position(initialPosition.x + (multiplierX), initialPosition.y + (multiplierY));
    if(passedPosition.samePosition(desiredPosition)) {
        if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
            return true;
        }
    }
    return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            let passedPosition = new Position(king.position.x + i, king.position.y + j);
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, king.team)) {
                possibleMoves.push(passedPosition);
            }
        }
    }
    return possibleMoves;
}
