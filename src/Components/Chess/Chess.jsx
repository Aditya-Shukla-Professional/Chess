import React,{useState} from 'react'
import './Chess.css'
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const ChessGame = () => {
  const [game,setGame]=useState(new Chess());
  const [fen,setFen]=useState("start");
  const [moveSquares, setMoveSquares] = useState({});
  const [winner,setWinner]=useState("");
  const [selectedSquare, setSelectedSquare] = useState(null);

  function onDrop(sourceSquare,targetSquare){
    try{
        if (game.isGameOver()) return false;
        const move=game.move({
            from:sourceSquare,
            to:targetSquare,
            promotion:"q"
        })

        if(move===null) return false;

        setFen(game.fen());

        if(game.isGameOver()){
          const lastTurn=game.turn()==="w"?"Black":"White";
          setWinner(`${lastTurn} wins! 🥳`)
        }
        return true
    }catch(error){
        console.error("Invalid Move!",error)
        return false;
    }
  }
  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setFen("start");
    setWinner("");
    setMoveSquares({});
  }
  function highlightPossibleMoves(square){
    const moves=game.moves({square,verbose:true});
    if(!moves.length){
        setMoveSquares({});
        return;
    }
    const newSquares={};
    newSquares[square] = {
      boxShadow: "inset 0 0 12px rgba(255,255,255,0.8)"
    };
    moves.forEach(move=>{
        newSquares[move.to]={
            background:move.captured ? "radial-gradient(circle, red 30%, transparent 40%)" : "radial-gradient(circle, green 30%, transparent 40%)",
            borderRadius:"50%"
        }
    })

    setMoveSquares(newSquares)
  }
  function onSquareClick(square){
    if(!selectedSquare){
      const piece=game.get(square);
      if(piece && piece.color===game.turn()){
        setSelectedSquare(square);
        highlightPossibleMoves(square);
      }
    }
    else{
      try{
        const move=game.move({
          from:selectedSquare,
          to:square,
          promotion:"q"
        })

        if(move===null){
          setSelectedSquare(null);
          setMoveSquares({});
        }
        setFen(game.fen())
        setSelectedSquare(null)
        setMoveSquares({})

        if(game.isGameOver()){
          const lastTurn=game.turn()==="w"?"Black":"White";
          setWinner(`${lastTurn} wins! 🥳`)
        }
      }catch(error){
        console.error("Invalid Move!",error)
        setSelectedSquare(null);
        setMoveSquares({})
      }
    }
  }
  function onMouseOutSquare(){
    setMoveSquares({});
  }
  function onMouseOverSquare(square){
    const piece=game.get(square);
    if (!piece || piece.color!==game.turn()) return;

    highlightPossibleMoves(square)
  }
  
  return (
    <div>
        <h1 className="text">{winner ? winner : "Let's Play a Round of Chess 🧐"}</h1>
        <div className="outerContainer">
            <div className="chessContainer">
              <Chessboard position={fen} boardWidth={Math.min(window.innerWidth - 60, 500)} onMouseOutSquare={onMouseOutSquare} onMouseOverSquare={onMouseOverSquare} customSquareStyles={moveSquares} onPieceDrop={onDrop} onSquareClick={onSquareClick}/>
            </div>
        </div>
        <button className="restartButton" onClick={resetGame}>Restart Game</button>
    </div>
  )
}

export default ChessGame