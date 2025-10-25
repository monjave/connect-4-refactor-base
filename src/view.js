
import { Events } from './events.js';

/**
 * DOM-only View. No game rules here.
 */
export class BoardView {
  constructor({ root, titleEl, p1El, p2El, turnEl, resetBtn, undoBtn, controller, commands }) {
    this.root = root; 
    this.titleEl = titleEl;
    this.p1El = p1El; 
    this.p2El = p2El; 
    this.turnEl = turnEl;
    this.resetBtn = resetBtn; 
    this.undoBtn = undoBtn; 
    this.controller = controller;
    this.commands = commands;

    this._listeners = new Map();

    this.p1 = +(localStorage.getItem('c4:p1')||0);
    this.p2 = +(localStorage.getItem('c4:p2')||0);

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

  on(eventName, handler) {
    if (!this._listeners.has(eventName)) this._listeners.set(eventName, new Set());
    this._listeners.get(eventName).add(handler);
    return () => this.off(eventName, handler); // allows for unsubscribing if needed
  }

  off(eventName, handler) {
    const s = this._listeners.get(eventName);
    if (!s) return;
    s.delete(handler);
    if (s.size === 0) this._listeners.delete(eventName);
  }

  emit(eventName, data) {
    const s = this._listeners.get(eventName);
    if (!s) return;
    Array.from(s).forEach(fn => {
      try { fn(data); } catch (e) { console.error('View listener error', e); }
    });
  }

  _wireEvents() {
  this.root.addEventListener('click', (e) => {
    const colEl = e.target.closest('.col');
    if (!colEl) return;
    const col = +colEl.dataset.col;
    // Tyler will implement this later
    if (this.commands?.executePlace) {
      this.commands.executePlace(col);
    } else {
      console.warn('CommandManager not implemented yet');
    }

    // Notify subscribers that a column was clicked
    this.emit('place', { col });
  });

    this.resetBtn.addEventListener('click', () => {
      this.controller.reset();
      this.emit('reset');
    });
  if (this.undoBtn) {
    this.undoBtn.addEventListener('click', () => {
      if (this.commands?.undo) {
        this.commands.undo();
      } else {
        console.warn('Undo not implemented yet');
      }
      this.emit('undo');
    });
  }

    // subscribe to controller events
    this.controller.on(Events.Moved, ({row, col, player}) => this._place(row, col, player));
    this.controller.on(Events.Won, ({player}) => this._won(player));
    this.controller.on(Events.Tie, () => this._tie());
    this.controller.on(Events.TurnChanged, ({player}) => this._updateTurn(player));
    this.controller.on(Events.Reset, () => this._resetBoard());
    this.controller.on(Events.Undone, ({row, col}) => this._clearCell(row, col));
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
