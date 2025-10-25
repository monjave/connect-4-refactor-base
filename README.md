# Connect 4 — Refactor Skeleton (Locked Module Boundaries)

This skeleton sets up the Connect-4 refactor project with **clear module boundaries** so each teammate can safely implement their assigned design pattern without breaking others' work.

---

## Pattern ownership 

| Teammate | Pattern | Responsibility |
|-----------|----------|----------------|
| **Mo** | **Facade** | Replace the original “God Script” with a `GameController` that manages game logic and emits events. |
| **Tyler** | **Command** | Implement `PlaceDisc` (Command) and a `CommandManager` to handle **placing pieces and undoing moves**. |
| **Bryden** | **Observer** | Connect the `BoardView` to controller events and manage all DOM updates. |

---

## Contracts (do not break)

### Events
`moved`, `won`, `tie`, `turnChanged`, `reset`, `undone`

### Controller (Facade)
`handleMove(col)`, `undoLast()`, `reset()`, `getCurrentPlayer()`, `getBoard()`, `on(evt, fn)`

### Board (Model)
`drop(col, player)`, `clearCell(row, col)`, `getCell(r, c)`, `rows`, `cols`, `clear()`

### Strategy
`won(board, row, col, player)`, `tied(board)`

### Command
`execute(controller)`, `undo(controller)`  
-> delegates all logic to the Controller (no DOM or board access)

### Command Manager
`executePlace(col)`, `undo()`  
-> manages a stack of `PlaceDisc` commands for undo/redo functionality

---

## Branch plan
| Order | Branch | Purpose |
|-------|---------|----------|
| 1 | `feat/facade-controller` | Core game logic (Mo) |
| 2 | `feat/win-strategy` | Win/tie detection (optional teammate) |
| 3 | `feat/command` | Command + Undo (Tyler) |
| 4 | `feat/view` | Observer-based UI (Bryden) |

---

## Run locally
1. Open `index.html` in VS Code.  
2. Right-click → **“Open with Live Server.”**  
3. Click columns to place pieces. Undo and Reset buttons are wired but currently log placeholders until the Command pattern is implemented.

---
 
**Repo purpose:** Baseline refactor for Connect 4 project presentation (Design Patterns)

