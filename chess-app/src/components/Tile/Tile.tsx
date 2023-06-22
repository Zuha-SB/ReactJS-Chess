import './Tile.css';

interface Props {
    piece?: string;
    number: number;
}

export default function Tile({ number, piece }: Props) {
    if(number % 2 === 0) {
        return (
            <div className='tile black-tile'>
                {piece && <div style={{backgroundImage: `url(${piece})`}} className='chess-piece'></div>}
            </div>
        );
    } else {
        return (
            <div className='tile white-tile'>
                {piece && <div style={{backgroundImage: `url(${piece})`}} className='chess-piece'></div>}
            </div>
        );
    }
}