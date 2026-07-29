# Socket.io Events

## Connecting

The socket connection now requires auth: pass the JWT (same token used for REST calls) as
`io(url, { auth: { token } })`. The server verifies it in an `io.use()` middleware and rejects
the connection (`connect_error`) if the token is missing/invalid/expired. This is also what lets
the server tell two tabs of the same account apart from two different accounts.

## Client → Server (emit)

| Event | Payload | Description |
|-------|---------|-------------|
| `join_queue` | none | Join matchmaking queue |
| `leave_queue` | none | Leave matchmaking queue |
| `paddle_move` | `{ room: string, direction: "up" \| "down" }` | Move paddle up or down |
| `request_rematch` | `{ room: string }` | Request a rematch |
| `decline_rematch` | `{ room: string }` | Decline a rematch |
<!-- | `send_message` | `{ fromUserId: number, toUserId: number, content: string }` | Send a chat message | -->

## Server → Client (on)

| Event | Payload | Description |
|-------|---------|-------------|
| `waiting` | none | You are in the queue waiting for opponent |
| `already_waiting` | none | You are already in the queue, OR the account already has a match in queue/in progress (same user tried to queue from a second tab/window) |
| `match_found` | `{ room: string, players: [string, string] }` | Match found, game starting |
| `game_state` | `{ ball, paddles, scores, players }` | Game state update (60fps) |
| `game_over` | `{ winnerSocketId: string, winnerId?: number, winnerUsername: string, scores: { left: number, right: number }, reason?: "disconnect" }` | Game ended (normal win or opponent disconnect) - same shape for both, `reason` is only set for the disconnect case |
| `player_disconnected` | none | Opponent disconnected, grace period started |
| `player_reconnected` | none | Opponent reconnected, game resumed |
| `rematch_requested` | none | Opponent wants a rematch |
| `rematch_declined` | none | Opponent declined rematch |

<!-- | `receive_message` | `{ id, createdAt, content, senderId, receiverId, sender }` | Incoming chat message |
| `message_sent` | `{ id, createdAt, content, senderId, receiverId, sender }` | Confirm message was saved |
| `message_error` | `{ error: string }` | Message failed to send | -->