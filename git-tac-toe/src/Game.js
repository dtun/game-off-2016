import React from 'react';
import GitHubMark from './resources/GitHubMark.png'
import Developer from './resources/Developer.png'

function Square(props) {
  if (!props.value) {
    return (
      <div className={props.className} id={`Square-${props.i}`} onClick={() => props.onClick()}>
        <label htmlFor={`Square-${props.i}`} className="element-invisible">{'Square-'+ props.i}</label>
      </div>
    )
  }
  return (
      <div className={props.className}>
        {props.value}
      </div>
  );
}

function Player(props) {
  return (
    <img src={props.src} alt={props.alt} />
  );
}

function calculateWinner(squares) {
  const lines = [
    //horiz check
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //verti check
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagn check
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] && squares[c]) {
      if (squares[a].props.src === squares[b].props.src && squares[a].props.src === squares[c].props.src) {
        const winners = [squares[a], squares[b], squares[c], lines[i]];
        return winners;
      }
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        className={this.props.winningKeys.includes(i) ? 'winningSquare' : 'square'}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        id={this.props.id ? this.props.id : 'Square'}
        i={i+1}
      />
    );
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
      winningKeys: [],
  };
  }
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.devIsNext ? <Player src={Developer} alt={'Developer-'+(i+1)} /> : <Player src={GitHubMark} alt={'GitHubMark-'+(i+1)} />;
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
      status = (
        <div>
          <div>Winner!</div>
          <div className="restart">
            <a onClick={() => location.reload()}>Restart</a>
          </div>
        </div>
      );
    } else if ( current.squares.every(elem => elem != null) ) {
        status = (
          <div>
            <div>{`Cat's game!`}</div>
            <div className="restart">
              <a onClick={() => location.reload()}>Restart</a>
            </div>
          </div>
        );
    } else {
        status = this.state.devIsNext ?
          <div>
            <Player src={Developer} alt='Developer' /> <div>select an empty square</div>
          </div>
          :
          <div>
            <Player src={GitHubMark} alt='GitHubMark' /> <div>select an empty square</div>
          </div>
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
        <div className="thankyou">
          <h2>
            for <a href="https://github.com/blog/2274-game-off-theme-announcement">github's game off 2016</a> |
            props to <a href="https://facebook.github.io/react/tutorial/tutorial.html">facebook's react tutorial</a> |
            i work at <a href="http://synapsestudios.com/">synapse studios</a>
          </h2>
        </div>
      </div>
    );
  }
}

export default Game;
