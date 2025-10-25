
/**
 * Command pattern — for placing pieces with undo functionality.
 */
export class PlaceDisc {
  constructor(col){ this.col = col; this._result = null; }
  execute(controller){
    this._result = controller.handleMove(this.col);
    return this._result;
  }
  undo(controller){
    // Delegates to controller's undoLast to keep rules centralized.
    return controller.undoLast();
  }
}
