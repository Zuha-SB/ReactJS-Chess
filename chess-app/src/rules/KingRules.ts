import { TeamType } from "../Types";
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
            let passedPosition = new Position(king.position.x + i, king.position.y + j); // eventually rename passedPosition to destination

            // Check if move is outside board
            if(passedPosition.x < 0 || passedPosition.x > 7 || passedPosition.y < 0 || passedPosition.y > 7) break;

            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, king.team)) {
                possibleMoves.push(passedPosition);
            }
        }
    }
    return possibleMoves;
}

// In this method, the enemy moves have already been calculated
export const getCastlingMoves = (king: Piece, boardState: Piece[]) : Position[] => {
    const possibleMoves: Position[] = [];

    if(king.hasMoved) return possibleMoves;

    // We get the rooks from the king's team that haven't moved
    const rooks = boardState.filter(p => p.isRook && p.team === king.team && !p.hasMoved)
    
    // Loop through the rooks
    for(const rook of rooks) {
        // Determine if we need to go to the left or right side
        const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;

        const adjacentPosition = king.position.clone();
        adjacentPosition.x += direction;

        if(!rook.possibleMoves?.some(m => m.samePosition(adjacentPosition))) continue;

        // We know that the rook can move to the adjacent side of the king

        const concerningTiles = rook.possibleMoves.filter(m => m.y === king.position.y); // This is a bug that will need to be fixed later


        // Checking if any of the enemy pieces can attack the space between
        // the rook and king
        const enemyPieces = boardState.filter(p => p.team !== king.team);

        let valid = true;

        for(const enemy of enemyPieces) {
            if(enemy.possibleMoves === undefined) continue;
            for(const move of enemy.possibleMoves) {
                if(concerningTiles.some(t => t.samePosition(move))) {
                    valid = false;
                }
                if(!valid) {
                    break;
                }
            }
            if(!valid) {
                break;
            }
        }
        if(!valid) continue;

        // Add move as possible move, we can castle
        possibleMoves.push(rook.position.clone());
    }

    return possibleMoves;
}
