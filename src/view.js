
import { Events } from './events.js';

/**
 * DOM-only View. No game rules here.
 */
export class BoardView {
  constructor({ root, titleEl, p1El, p2El, turnEl, resetBtn, undoBtn, redoBtn, controller, commands }) {
    this.root = root; 
    this.titleEl = titleEl;
    this.p1El = p1El; 
    this.p2El = p2El; 
    this.turnEl = turnEl;
    this.resetBtn = resetBtn; 
    this.undoBtn = undoBtn; 
    this.redoBtn = redoBtn;
    this.controller = controller;
    this.commands = commands;

    this.p1 = +(localStorage.getItem('c4:p1')||0);
    this.p2 = +(localStorage.getItem('c4:p2') || 0);
    
    this._handlers = {
      moved: ({ row, col, player }) => this._place(row, col, player),
      won: ({ player }) => this._won(player),
      tie: () => this._tie(),
      turnChanged: ({ player }) => this._updateTurn(player),
      reset: () => this._resetBoard(),
      undone: ({ row, col }) => this._clearCell(row, col),
    };

    this.controller.on(Events.Moved, this._handlers.moved);
    this.controller.on(Events.Won, this._handlers.won);
    this.controller.on(Events.Tie, this._handlers.tie);
    this.controller.on(Events.TurnChanged, this._handlers.turnChanged);
    this.controller.on(Events.Reset, this._handlers.reset);
    this.controller.on(Events.Undone, this._handlers.undone);

    this._renderStatic();
    this._wireEvents();
  }

  _renderStatic(){
    const board = this.controller.getBoard();
    const rows = board.rows, cols = board.cols;

    // top clickable "header" row
    const top = document.createElement('div');
    top.className = 'top';
    for (let c = 0; c < cols; c++) {
      const col = document.createElement('div');
      col.className = 'col';
      col.dataset.col = c;
      top.appendChild(col);
    }
    this.root.appendChild(top);

    // grid cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${r}-${c}`;
        this.root.appendChild(cell);
      }
    }

    this._updateTurn(1);
    this._updateScores();
  }

  _wireEvents() {
  this.root.addEventListener('click', (e) => {
    const colEl = e.target.closest('.col');
    if (!colEl) return;
    const col = +colEl.dataset.col;
    if (this.commands?.executePlace) {
      this.commands.executePlace(col);
    } else {
      console.warn('CommandManager not implemented yet');
    }
  });

  this.resetBtn.addEventListener('click', () => this.controller.reset());
  if (this.undoBtn) {
    this.undoBtn.addEventListener('click', () => {
      if (this.commands?.undo) {
        this.commands.undo();
      } else {
        console.warn('Undo not implemented yet');
      }
    });
  }

  if (this.redoBtn) {
    this.redoBtn.addEventListener('click', () => {
      if (this.commands?.redo) {
        this.commands.redo();
      } else {
        console.warn('Redo not implemented yet');
      }
    });
  }
  }

  _place(row, col, player){
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (!cell) return;
    cell.classList.remove('p1','p2');
    cell.classList.add(player === 1 ? 'p1' : 'p2');
  }

  _clearCell(row, col){
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (!cell) return;
    cell.classList.remove('p1','p2');
  }

  _won(player){
    this.titleEl.textContent = `Player ${player} wins!`;
    if (player === 1) this.p1++; else this.p2++;
    localStorage.setItem('c4:p1', this.p1);
    localStorage.setItem('c4:p2', this.p2);
    this._updateScores();
  }

  _tie(){ this.titleEl.textContent = 'Tie!'; }

  _updateTurn(player){ this.turnEl.textContent = String(player); }

  _updateScores(){
    this.p1El.textContent = String(this.p1);
    this.p2El.textContent = String(this.p2);
  }

  _resetBoard(){
    this.titleEl.textContent = 'Connect 4';
    const cells = this.root.querySelectorAll('.cell');
    cells.forEach(c => c.classList.remove('p1','p2'));
  }
}
