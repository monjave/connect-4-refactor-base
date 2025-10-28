// src/command_manager.js
import { PlaceDisc } from './PlaceDiskCommand.js';

export class CommandManager {
  constructor(controller) {
    this.controller = controller;
    this.history = new CommandHistory();
  }

  executePlace(col) {
    this.history.execute(new PlaceDisc(col, this.controller));
  }

  undo() {
    this.history.undo();
  }

  redo() {
    this.history.redo();
  }
}

class CommandHistory {
  constructor() {
    this.undoStack = []; // stack of commands for undo
    this.redoStack = []; // stack of commands for redo
  }

  execute(command) {
    const result = command.execute();
    if(result) {
      this.undoStack.push(command);
      this.redoStack.length = 0; // clear redo on new action
    }
    return result;
  }

  undo() {
    if (this.undoStack.length === 0) return false;

    const command = this.undoStack.pop();
    const undo = command.undo();
    if (undo) {
      this.redoStack.push(command);
    }

    return undo;
  }

  redo() {
    if (this.redoStack.length === 0) return false;

    const command = this.redoStack.pop();
    const redo = command.execute();
    if (redo) {
      this.undoStack.push(command);
    }

    return redo;
  }
}
