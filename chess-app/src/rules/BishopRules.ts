import { TeamType } from "../Types";
import { Position, Piece } from "../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const bishopMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    //MOVEMENT LOGIC
    for(let i = 1; i < 8; i++) {

        //TOP RIGHT
        if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y + i);
            if(passedPosition.samePosition(desiredPosition)) {
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if(tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }

        //BOTTOM RIGHT
        if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
            let passedPosition = new Position(initialPosition.x + i, initialPosition.y - i);
            if(passedPosition.samePosition(desiredPosition)) {
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if(tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }

        //BOTTOM LEFT
        if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y - i);
            if(passedPosition.samePosition(desiredPosition)) {
                if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                    return true;
                }
            } else {
                if(tileIsOccupied(passedPosition, boardState)) {
                    break;
                }
            }
        }

        //TOP LEFT
        if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
            let passedPosition = new Position(initialPosition.x - i, initialPosition.y + i);
            if(passedPosition.samePosition(desiredPosition)) {
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

export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    //Upper right movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(bishop.position.x + i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    //Upper left movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(bishop.position.x - i, bishop.position.y + i);

        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    //Bottom right movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(bishop.position.x + i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    //Bottom left movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(bishop.position.x - i, bishop.position.y - i);

        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, bishop.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}
