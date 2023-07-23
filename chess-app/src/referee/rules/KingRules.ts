import { Position, TeamType, Piece, samePosition } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {   
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

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];
    for(let i = -1; i < 2; i++) {
        for(let j = -1; j < 2; j++) {
            let passedPosition: Position = {x: king.position.x + i, y: king.position.y + j};
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, king.team)) {
                possibleMoves.push(passedPosition);
            }
        }
    }
    return possibleMoves;
}
