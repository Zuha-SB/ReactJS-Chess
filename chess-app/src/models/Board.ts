import { Piece, Position } from ".";
import { PieceType, TeamType } from "../Types";
import { getPossiblePawnMoves, getPossibleKnightMoves, getPossibleBishopMoves, getPossibleRookMoves, getPossibleQueenMoves, getPossibleKingMoves } from "../rules";
import { Pawn } from "./Pawn";

export class Board {
    pieces: Piece[];
    constructor(pieces: Piece[]) {
        this.pieces = pieces;
    }

    calculateAllMoves() {
        for(const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }

        const king = this.pieces.find(p => p.isKing && p.team === TeamType.OPPONENT);

        if(king?.possibleMoves === undefined) return;

        const originalKingPosition = king.position.clone();
        // simulate king moves
        for(const move of king.possibleMoves) {
            king.position = move;

            let safe = true;

            // Determine if the move is safe
            for(const p of this.pieces) {
                if(p.team === TeamType.OPPONENT) continue;
                if(p.isPawn) {
                    const possiblePawnMoves = this.getValidMoves(p, this.pieces);
                    if(possiblePawnMoves?.some(ppm => ppm.x !== p.position.x && ppm.samePosition(move))) {
                        safe = false;
                    }
                } else if(p.possibleMoves?.some(p => p.samePosition(move))) {
                    safe = false;
                }
            }

            if(!safe) {
                //remove move from possiblemoves
                king.possibleMoves = king.possibleMoves?.filter(m => !m.samePosition(move));
            }
        }
        king.position = originalKingPosition;
    }

    getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
        switch(piece.type) {
            case PieceType.PAWN:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.KING:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove: boolean, validMove: boolean, playedPiece: Piece, destination: Position) : boolean {
        const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;
        
        if(enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    if(piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    results.push(piece);
                } else if(!(piece.samePosition(new Position(destination.x, destination.y - pawnDirection)))) {
                    if(piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[])

            this.calculateAllMoves();

        } else if(validMove) {
            //Updates the piece position
            //And if a piece is attacked, removes it
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    //SPECIAL MOVE
                    if(piece.isPawn) {
                        (piece as Pawn).enPassant = Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN;
                    }
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;

                    results.push(piece);
                } else if(!(piece.samePosition(destination))) {
                    if(piece.isPawn) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            this.calculateAllMoves();
        } else {
            return false;
        }
        return true;
    }

    clone(): Board {
        return new Board(this.pieces.map(p => p.clone()));
    }

}