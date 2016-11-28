import React from 'react';
import './App.css';
import GitHubMark from './GitHubMark.png'
import Developer from './Developer.png'

function Square(props) {
  return (
    <button className={props.className} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    //horiz check
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //vert check
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diag check
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winners = [squares[a], squares[b], squares[c], lines[i]];
      return winners;
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square className={this.props.winningKeys.includes(i) ? 'winningSquare' : 'square'} id={this.props.id} key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      devIsNext: true,
      stepNumber: 0,
      githubmark: <img src={GitHubMark} alt='GitHubMark' />,
      developer: <img src={Developer} alt='Developer' />,
      winningKeys: [0],
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.devIsNext ? this.state.developer : this.state.githubmark;
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      devIsNext: !this.state.devIsNext,
      stepNumber: (this.state.stepNumber + 1),
      winningKeys: calculateWinner(squares),
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      devIsNext: (step % 2) ? false : true,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let keysToCheck = [null,null,null];

    let status;
    if (winner) {
      keysToCheck = this.state.winningKeys[3];
      status = (<div>{winner[0]} is the winner!</div>);
    } else if ( current.squares.every(elem => elem != null) ) {
        status = (<div>Cat's game!</div>);
    } else {
        status = this.state.devIsNext ? this.state.developer : this.state.githubmark;
    }
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    return (
      <div className="game">
        <h1 className="headline">Git Tac Toe</h1>
        <div className="game-board">
          <Board
            winningKeys={keysToCheck}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <a onClick={() => location.reload()}>Restart</a>
      </div>
    );
  }
}

export default Game;
