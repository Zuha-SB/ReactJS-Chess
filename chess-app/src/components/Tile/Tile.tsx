import './Tile.css';

interface Props {
    piece?: string;
    number: number;
    highlight: boolean;
}

export default function Tile({ number, piece, highlight }: Props) {

    const className: string = ["tile", 
        number % 2 === 0 && "black-tile", 
        number % 2 !==0 && "white-tile", 
        highlight && "tile-highlight"].filter(Boolean).join(' ');

    return (
        <div className={className}>
            {piece && <div style={{backgroundImage: `url(${piece})`}} className='chess-piece'></div>}
        </div>
    );
}