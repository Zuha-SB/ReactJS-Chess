import { Position } from ".";
import { PieceType, TeamType } from "../Constants";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
    possibleMoves?: Position[];
    
    constructor(position: Position, type: PieceType, team: TeamType) {
        this.image = `chess-pieces/${type}_${team}.png`;
        this.position = position;
        this.type = type;
        this.team = team;
    }

    samePiecePosition(otherPiece: Piece) : boolean {
        return this.position.samePosition(otherPiece.position);
    }

    samePosition(otherPosition: Position) : boolean {
        return this.position.samePosition(otherPosition);
    }

}