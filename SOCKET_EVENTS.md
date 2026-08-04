# Socket.io Events

## Connecting

The socket connection now requires auth: pass the JWT (same token used for REST calls) as
`io(url, { auth: { token } })`. The server verifies it in an `io.use()` middleware and rejects
the connection (`connect_error`) if the token is missing/invalid/expired. This is also what lets
the server tell two tabs of the same account apart from two different accounts.

## Client → Server (emit)

| Event | Payload | Description |
|-------|---------|-------------|
**MATCHMAKING**
| `join_queue` | none | Join matchmaking queue |
| `leave_queue` | none | Leave matchmaking queue |

**GAMEPLAY**
| `paddle_move` | `{ room: string, direction: "up" or "down" }` | Move paddle up or down |

**REMATCH**
| `request_rematch` | `{ room: string }` | Request a rematch |
| `decline_rematch` | `{ room: string }` | Decline a rematch |

**MESSAGES**
<!-- | `send_message` | `{ fromUserId: number, toUserId: number, content: string }` | Send a chat message | -->

## Server → Client (on)

| Event | Payload | Description |
|-------|---------|-------------|
**MATCHMAKING**
| `waiting` | none | You are in the queue waiting for opponent |
| `already_waiting` | none | You are already in the queue, OR the account already has a match in queue/in progress (same user tried to queue from a second tab/window) |
| `match_found` | `{ room: string, players: [string, string], avatars: { left: string \| null, right: string \| null } }` | Match found, game starting. `players`/`avatars` are both `[left, right]`-ordered pairs; avatar is whatever was in the DB when the socket connected (`null` if unset or not fetched yet) |

**GAMEPLAY**
| `game_state` | `{ ball, paddles, scores, players, countdownEndsAt: number or null, pendingPowerUp: PendingPowerUp or null, activeEffects: { left, right }, dynamicConfig: { paddleHeights: { left, right }, ballSize } }` | Game state update (60fps). `countdownEndsAt` is set for the ~3s pre-match countdown (ball is held until it passes); `activeEffects[side]` is `{ type: PowerUpType, expiresAt } or null`; `dynamicConfig` reflects live paddle heights / ball size while a power-up effect is active |

**POWER-UPS**
| `power_up_incoming` | `PendingPowerUp` = `{ type: PowerUpType, side: "left" or "right", applyAt: number }` | A power-up has been chosen and will self-activate at `applyAt` (~2s warning, no need to touch anything to trigger it) |
| `power_up_activated` | `{ type: PowerUpType, side: "left" or "right" }` | The announced power-up just took effect |
| `power_up_expired` | `{ type: PowerUpType, side: "left" or "right" }` | A power-up's 5s effect just ended |

**GAME END / CONNECTION**
| `game_over` | `{ winnerSocketId: string, winnerId?: number, winnerUsername: string, scores: { left: number, right: number }, reason?: "disconnect" }` | Game ended (normal win or opponent disconnect) - same shape for both, `reason` is only set for the disconnect case |
| `player_disconnected` | none | Opponent disconnected, grace period started |
| `player_reconnected` | none | Opponent reconnected, game resumed |

**REMATCH**
| `rematch_requested` | none | Opponent wants a rematch |
| `rematch_accepted` | none | Opponent accepted your rematch request - `match_found` follows right after |
| `rematch_declined` | none | Opponent declined rematch |
| `rematch_failed` | none | Both players requested a rematch, but the other one disconnected before the new match could start |

**MESSAGES**
<!-- | `receive_message` | `{ id, createdAt, content, senderId, receiverId, sender }` | Incoming chat message |
| `message_sent` | `{ id, createdAt, content, senderId, receiverId, sender }` | Confirm message was saved |
| `message_error` | `{ error: string }` | Message failed to send | -->


**NOTES**
`PowerUpType` is one of `"bigPaddle" | "smallPaddle" | "freeze" | "smallBall" | "paddleSpeedBoost"`. `bigPaddle`/`smallBall`/`paddleSpeedBoost` buff the collector; `smallPaddle`/`freeze` debuff the opponent instead.
