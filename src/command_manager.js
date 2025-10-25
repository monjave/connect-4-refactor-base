// src/command_manager.js
// Placeholder for Tyler's Command Manager (undo/redo)

export class CommandManager {
  constructor(controller) {
    this.controller = controller;
    // Tyler will later add: undoStack, redoStack, and executePlace(col)
  }

  // placeholder methods (do nothing for now)
  executePlace(col) {
    console.warn('CommandManager.executePlace() not yet implemented');
  }

  undo() {
    console.warn('CommandManager.undo() not yet implemented');
  }
}
