# Socket.io Events

## Client → Server (emit)

| Event | Payload | Description |
|-------|---------|-------------|
| `join_queue` | none | Join matchmaking queue |
| `paddle_move` | `{ room: string, direction: "up" \| "down" }` | Move paddle up or down |

## Server → Client (on)

| Event | Payload | Description |
|-------|---------|-------------|
| `waiting` | none | You are in the queue waiting for opponent |
| `already_waiting` | none | You are already in the queue |
| `match_found` | `{ room: string, players: [string, string] }` | Match found, game starting |
| `game_state` | `{ ball, paddles, scores, players }` | Game state update (60fps) |
| `game_over` | `{ winner: string, scores: { left: number, right: number } }` | Game ended |
| `player_disconnected` | none | Opponent disconnected |