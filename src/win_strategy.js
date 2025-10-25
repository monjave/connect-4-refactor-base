
/**
 * Strategy for checking wins/ties.
 * This minimal version is working; teammate can refine if desired.
 */
export class FourInARowStrategy {
  won(board, row, col, player){
    const dirs = [[1,0],[0,1],[1,1],[1,-1]];
    const count = (r,c,dx,dy) => {
      let k=0;
      while (r>=0 && r<board.rows && c>=0 && c<board.cols && board.getCell(r,c)===player){
        k++; r+=dy; c+=dx;
      }
      return k;
    };
    return dirs.some(([dx,dy]) => (count(row,col, dx,dy) + count(row,col, -dx,-dy) - 1) >= 4);
  }
  tied(board){
    return board.grid.every(row => row.every(cell => cell !== null));
  }
}
