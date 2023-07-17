import { Position, PieceType, TeamType, Piece, samePosition } from "../Constants";

export default class Referee {
    tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
        return !this.tileIsOccupied(position, boardState) || this.tileIsOccupiedByOpponent(position, boardState, team);
    }

    tileIsOccupied(position: Position, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => samePosition(p.position, position));
        if(piece) {
            return true;
        } else {
            return false;
        }
    }

    tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
        const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team);

        if(piece) {
            return true;
        } else {
            return false;
        }
    }

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

    pawnMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        const specialRow = (team === TeamType.OUR) ? 1 : 6;
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        //Movement logic
        if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y - initialPosition.y === 2 * pawnDirection) {
            if(!this.tileIsOccupied(desiredPosition, boardState) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - pawnDirection}, boardState)) {
                return true;
            }
        } else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === pawnDirection){
            if(!this.tileIsOccupied(desiredPosition, boardState)) {
                return true;
            }
        }

        //Attack logic
        else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection) {
            //Attack to the left
            if(this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                return true;
            }
        } else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
            //Attack to the right
            if(this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
                return true;
            }
        }
        return false;
    }

    knightMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        //MOVING LOGIC FOR THE KNIGHT
        for(let i = -1; i < 2; i+=2) {
            for(let j = -1; j < 2; j+=2) {
                //TOP AND BOTTOM SIDE MOVEMENT
                if(desiredPosition.y - initialPosition.y === 2 * i) {
                    if(desiredPosition.x - initialPosition.x === j) {
                        if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                            return true;
                        }
                    }
                }
                //RIGHT AND LEFT SIDE MOVEMENT
                if(desiredPosition.x - initialPosition.x === 2 * i) {
                    if(desiredPosition.y - initialPosition.y === j) {
                        if(this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    bishopMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        //MOVEMENT LOGIC
        for(let i = 1; i < 8; i++) {

            //TOP RIGHT
            if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //BOTTOM RIGHT
            if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //BOTTOM LEFT
            if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //TOP LEFT
            if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
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
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
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
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }   
        return false;
    }
    
    queenMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        //MOVEMENT LOGIC
        for(let i = 1; i < 8; i++) {

            //TOP RIGHT
            if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y + i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //BOTTOM RIGHT
            if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x + i, y: initialPosition.y - i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //BOTTOM LEFT
            if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y - i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }

            //TOP LEFT
            if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
                let passedPosition: Position = {x: initialPosition.x - i, y: initialPosition.y + i};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }
        if(initialPosition.x === desiredPosition.x) {
            for(let i = 1; i < 8; i++) {
                let multiplier = (desiredPosition.y < initialPosition.y) ? -1 : 1;
                let passedPosition: Position = {x: initialPosition.x, y: initialPosition.y + (i*multiplier)};
                if(samePosition(passedPosition, desiredPosition)) {
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
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
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
                        return true;
                    }
                } else {
                    if(this.tileIsOccupied(passedPosition, boardState)) {
                        break;
                    }
                }
            }
        }   
        return false;
    }
    
    kingMove(initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean {
        return false;
    }

    isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
        let validMove = false;
        switch(type) {
            case PieceType.PAWN:
                validMove = this.pawnMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = this.knightMove(initialPosition, desiredPosition, team, boardState);
                break;
            case PieceType.BISHOP:
                validMove = this.bishopMove(initialPosition, desiredPosition, team, boardState);
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