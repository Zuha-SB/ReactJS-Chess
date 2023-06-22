import Tile from '../Tile/Tile'
import './Chessboard.css';

const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Chessboard() {
    let board = [];
    for(let j = ranks.length-1; j >= 0; j--) {
        for(let i = 0; i < files.length; i++) {
            const sum = j + i;
            board.push(<Tile number={sum}/>);
        }
    }
    return <div id="chessboard">{board}</div>
}