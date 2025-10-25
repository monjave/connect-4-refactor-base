
# Connect 4 — Refactor Skeleton (Locked Module Boundaries)

Patterns mapped to teammates (from Discord decision):
- **Mo** — Fix the *God Script* with **Facade** (`GameController`) and evented boundaries.
- **Tyler** — **Command** for placing pieces **with undo** (`PlaceDisc`).
- **Bryden** — **Observer** (subscribing View/Scoreboard to controller events).
- *(Optional teammate)* — **Strategy** for win condition (`FourInARowStrategy`).

## Contracts (do not break)
- **Events:** `moved`, `won`, `tie`, `turnChanged`, `reset`, `undone`
- **Controller (Facade):** `handleMove(col)`, `undoLast()`, `reset()`, `getCurrentPlayer()`, `getBoard()`, `on(evt,fn)`
- **Board (Model):** `drop(col,player)`, `clearCell(row,col)`, `getCell(r,c)`, `rows`, `cols`, `clear()`
- **Strategy:** `won(board,row,col,player)`, `tied(board)`
- **Command:** `execute(controller)`, `undo(controller)` (delegates to controller)

## Branch plan
- `feat/facade-controller` → `feat/win-strategy` → `feat/command` → `feat/view`

Open `index.html` with Live Server to run.
