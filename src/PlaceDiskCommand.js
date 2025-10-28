
/**
 * Command pattern — for placing pieces with undo functionality.
 */
export class PlaceDisc {
  constructor(col, controller)
  { 
    this.col = col; 
    this._move = null;
    this.controller = controller;
  }

  execute(){
    this._move = this.controller.handleMove(this.col); // Returns {row, col, player} or null
    return this._move !== null;
  }

  undo(){
    if(this._move) {
      this.controller.undoMove(this._move);
    }
    return this._move !== null;
  }
}
