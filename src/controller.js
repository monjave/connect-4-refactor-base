
import { Board } from './board.js';
import { Events } from './events.js';

/**
 * Facade/Controller — Mo's part: replaces the "God Script". No DOM here.
 */

export class GameController {
  #listeners = {};
  constructor({ rows=6, cols=7, winStrategy }) {
    this.board = new Board(rows, cols);
    this.win = winStrategy;
    this.player = 1;
    this.gameOver = false;
  }
  on(evt, fn){ (this.#listeners[evt] ??= []).push(fn); }
  #emit(evt, payload={}){ (this.#listeners[evt]||[]).forEach(f=>f(payload)); }

  handleMove(col){
    if (this.gameOver) return null;
    const res = this.board.drop(col, this.player);
    if (!res) return null;
    const { row } = res;

    const move = { row, col, player: this.player };
    this.#emit(Events.Moved, move);

    if (this.win?.won(this.board, row, col, this.player)) {
      this.gameOver = true;
      this.#emit(Events.Won, { player: this.player });
      return move;
    }
    if (this.win?.tied(this.board)) {
      this.gameOver = true;
      this.#emit(Events.Tie, {});
      return move;
    }
    this.player = this.player === 1 ? 2 : 1;
    this.#emit(Events.TurnChanged, { player: this.player });
    return move;
  }

  /**
   * undoes a previously made move by clearing the cell and restoring the turn
   * 
   * @param {{row: number, col: number, player: number}} move - the move to undo
   * @returns {{row: number, col: number, player: number}} the undone move
   * @fires Events.Undone
   * @fires Events.TurnChanged
   */
  undoMove(move){
    const { row, col, player } = move;
    this.board.clearCell(row, col);
    this.gameOver = false; // allow continued play
    this.player = player;  // revert turn to the player who moved
    this.#emit(Events.Undone, { row, col });
    this.#emit(Events.TurnChanged, { player: this.player });
    return move;
  }

  reset(){
    this.board.clear();
    this.player = 1;
    this.gameOver = false;
    this.#emit(Events.Reset, {});
    this.#emit(Events.TurnChanged, { player: this.player });
  }

  getCurrentPlayer(){ return this.player; }
  getBoard(){ return this.board; }
}
