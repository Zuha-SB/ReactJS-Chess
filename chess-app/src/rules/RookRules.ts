import { TeamType } from "../Types";
import { Position, Piece } from "../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
    if(initialPosition.x === desiredPosition.x) {
        for(let i = 1; i < 8; i++) {
            let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
            let passedPosition = new Position(initialPosition.x, initialPosition.y + (i*multiplier));
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
    if(initialPosition.y === desiredPosition.y) {
        for(let i = 1; i < 8; i++) {
            let multiplier = (desiredPosition.x < initialPosition.x) ? -1 : 1;
            let passedPosition = new Position(initialPosition.x + (i*multiplier), initialPosition.y);
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

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    //Up movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x, rook.position.y + i);
        
        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }
    
    //Down movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x, rook.position.y - i);
        
        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    //Left movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x - i, rook.position.y);
        
        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    //Right movement
    for(let i = 1; i < 8; i++) {
        const destination = new Position(rook.position.x + i, rook.position.y);
        
        if(!tileIsOccupied(destination, boardState)) {
            possibleMoves.push(destination);
        } else if(tileIsOccupiedByOpponent(destination, boardState, rook.team)){
            possibleMoves.push(destination);
            break;
        } else {
            break;
        }
    }

    return possibleMoves;
}