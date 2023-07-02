export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface Piece {
    piece: string;
    x: number;
    y: number;
    type: PieceType;
    team: TeamType;
    enPassant?: boolean;
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING
}

export enum TeamType {
    OPPONENT,
    OUR
}

export const initialBoardState: Piece[] = [
    //Black Pieces
    {
        piece: `chess-pieces/rook_b.png`, 
        x: 0, 
        y: 7, 
        type: PieceType.ROOK, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/knight_b.png`, 
        x: 1, 
        y: 7, 
        type: PieceType.KNIGHT, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/bishop_b.png`, 
        x: 2, 
        y: 7, 
        type: PieceType.BISHOP, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/queen_b.png`, 
        x: 3, 
        y: 7, 
        type: PieceType.QUEEN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/king_b.png`, 
        x: 4, 
        y: 7, 
        type: PieceType.KING, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/bishop_b.png`, 
        x: 5, 
        y: 7, 
        type: PieceType.BISHOP, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/knight_b.png`, 
        x: 6, 
        y: 7, 
        type: PieceType.KNIGHT, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/rook_b.png`, 
        x: 7, 
        y: 7, 
        type: PieceType.ROOK, 
        team: TeamType.OPPONENT
    },
    //Black Pawns
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 0, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 1, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 2, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 3, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 4, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 5, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 6, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    {
        piece: `chess-pieces/pawn_b.png`, 
        x: 7, 
        y: 6, 
        type: PieceType.PAWN, 
        team: TeamType.OPPONENT
    },
    
    //White Pieces
    {
        piece: `chess-pieces/rook_w.png`, 
        x: 0, 
        y: 0, 
        type: PieceType.ROOK, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/knight_w.png`, 
        x: 1, 
        y: 0, 
        type: PieceType.KNIGHT, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/bishop_w.png`, 
        x: 2, 
        y: 0, 
        type: PieceType.BISHOP, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/queen_w.png`, 
        x: 3, 
        y: 0, 
        type: PieceType.QUEEN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/king_w.png`, 
        x: 4, 
        y: 0, 
        type: PieceType.KING, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/bishop_w.png`, 
        x: 5, 
        y: 0, 
        type: PieceType.BISHOP, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/knight_w.png`, 
        x: 6, 
        y: 0, 
        type: PieceType.KNIGHT, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/rook_w.png`, 
        x: 7, 
        y: 0, 
        type: PieceType.ROOK, 
        team: TeamType.OUR
    },
    //White Pawns
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 0, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 1, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 2, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 3, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 4, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 5, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 6, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    },
    {
        piece: `chess-pieces/pawn_w.png`, 
        x: 7, 
        y: 1, 
        type: PieceType.PAWN, 
        team: TeamType.OUR
    }
];
