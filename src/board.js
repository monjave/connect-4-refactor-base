
export class Board {
  constructor(rows, cols) {
    this._rows = rows;
    this._cols = cols;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  }
  get rows(){ return this._rows; }
  get cols(){ return this._cols; }
  getCell(r, c){ return this.grid[r]?.[c] ?? null; }

  /**
   * Drop a piece into a column for a player (1 or 2).
   * @returns {{row:number, col:number}|null} Landing position or null if column full.
   */
  drop(col, player){
    for (let r = this._rows - 1; r >= 0; r--) {
      if (this.grid[r][col] == null) {
        this.grid[r][col] = player;
        return { row: r, col };
      }
    }
    return null;
  }

  /** Clear a specific cell (used for undo). */
  clearCell(row, col){
    if (row>=0 && row<this._rows && col>=0 && col<this._cols) {
      this.grid[row][col] = null;
    }
  }

  /** Reset grid to empty */
  clear(){
    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._cols; c++) this.grid[r][c] = null;
    }
  }
}
