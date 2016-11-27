import React from 'react';
import './App.css';
import GitHubMark from './GitHubMark.png'
import Developer from './Developer.png'

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
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
        <div className="status">{status}</div>
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
      githubmark: <img src={GitHubMark} alt='GitHubMark' />,
      developer: <img src={Developer} alt='Developer' />,
    };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1]
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
    });
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = (<div>{winner} is the winner!</div>);
    } else if ( current.squares.every(elem => elem != null) ) {
        status = (<div>Cat's game!</div>);
    } else {
        status = this.state.devIsNext ? this.state.developer : this.state.githubmark;
    }
    return (
      <div className="game">
        <h1 className="headline">Git Tac Toe</h1>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
        <a onClick={() => location.reload()}>Restart</a>
      </div>
    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
