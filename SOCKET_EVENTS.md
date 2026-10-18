# Socket.io Events

- [Connecting](#connecting)
- [Client → Server (emit)](#client--server-emit): [Matchmaking](#matchmaking) · [Gameplay](#gameplay) · [Rematch](#rematch) · [Invites](#invites) · [Messages](#messages)
- [Server → Client (on)](#server--client-on): [Matchmaking](#matchmaking-1) · [Gameplay](#gameplay-1) · [Power-ups](#power-ups) · [Game end / connection](#game-end--connection) · [Online](#online) · [Rematch](#rematch-1) · [Invites](#invites-1) · [Messages](#messages-1)
- [Types](#types)

---

## Connecting

The socket connection requires auth: pass the JWT (same token used for REST calls) as
`io(url, { auth: { token } })`. The server verifies it in an `io.use()` middleware and rejects
the connection (`connect_error`) if the token is missing, invalid or expired. This is also what lets
the server tell two tabs of the same account apart from two different accounts.

---

## Client → Server (emit)

### Matchmaking

| Event | Payload | Description |
|-------|---------|-------------|
| `join_queue` | none | Join the matchmaking queue. Silently ignored if you're already in a game (in this tab or another one). If your current match is paused on a disconnected opponent, queueing leaves it first (same as `leave_game`). |
| `leave_queue` | none | Leave the matchmaking queue. |

### Gameplay

| Event | Payload | Description |
|-------|---------|-------------|
| `paddle_move` | `{ room: string, direction: "up" \| "down" }` | Move your paddle up or down. |
| `leave_game` | none | Leave a match that is paused because the opponent disconnected (the "Leave Game" button). The match is dropped immediately with no winner, so no `game_over` follows. Ignored if you're not in a paused match. |

### Rematch

| Event | Payload | Description |
|-------|---------|-------------|
| `request_rematch` | `{ room: string }` | Request a rematch, or accept one (both players sending it starts the new match). If you're not in that room (for example after reconnecting with a new socket) or you're already in another match, you get `rematch_declined` back. Same if the opponent left the result screen, disconnected or is in another match, and then they get no request. |
| `decline_rematch` | `{ room: string }` | Decline a rematch. Also send it when leaving the result screen without a rematch ("Return to Main Menu", "Find New Opponent"): it takes you out of the old room so later rematch requests for that match don't reach you. The opponent only gets `rematch_declined` if a rematch was asked for, by them or by you (so their request popup closes). |

### Invites

| Event | Payload | Description |
|-------|---------|-------------|
| `invite_friend` | `{ friendId: number, winningScore?: number }` | Invite a specific friend to play. `winningScore` is the max score of the match, one of `WINNING_SCORE_OPTIONS` (3, 5, 7, 11); it defaults to 5 if omitted. Fails with `invite_error` if `winningScore` isn't an allowed value, you invite yourself, you're already in a game, the friend is offline, the friend is already in a game, you already have a pending invite (to them or to anyone else), or they already have a pending invite from someone else. |
| `cancel_invite` | `{ friendId: number }` | Cancel an invite you sent before the friend responds. |
| `invite_response` | `{ fromUserId: number, accepted: boolean }` | Accept or decline an invite you received from `fromUserId`. |

### Messages

Messages are sent over REST, not a socket event: see `POST /messages` and `GET /messages/:friendId` (`/api-docs`). The socket is only used for live delivery (see [`receive_message`](#messages-1)).

---

## Server → Client (on)

### Matchmaking

| Event | Payload | Description |
|-------|---------|-------------|
| `waiting` | none | You are in the queue, waiting for an opponent. |
| `already_waiting` | none | You are already in the queue, from this tab or another tab/window of the same account. Not sent if you're already in a match (that `join_queue` is silently ignored). |
| `match_found` | `{ room: string, players: [string, string], avatars: { left: string \| null, right: string \| null }, winningScore: number }` | Match found, game starting. `winningScore` is the score needed to win: always 5 for random matchmaking, the invite's value for friend matches, and the same value as the previous match for a rematch. `players` and `avatars` are both `[left, right]`-ordered. Usernames and avatars are the current ones (a rename or new avatar shows up without reconnecting); an avatar is `null` if unset. |

### Gameplay

| Event | Payload | Description |
|-------|---------|-------------|
| `game_state` | see [`game_state` payload](#game_state-payload) | Game state update, 60 times per second. |
| `paddle_hit` | `{ side: "left" \| "right" }` | The ball just bounced off that side's paddle (used for sound effects). |

#### `game_state` payload

```ts
{
  ball,
  paddles,
  scores,
  players,
  countdownEndsAt: number | null,
  pendingPowerUp: PendingPowerUp | null,
  activeEffects: { left, right },
  dynamicConfig: { paddleHeights: { left, right }, ballSize },
}
```

- `countdownEndsAt` is set during the ~3 s pre-match countdown; the ball is held until it passes.
- `activeEffects[side]` is `{ type: PowerUpType, expiresAt }` or `null`.
- `dynamicConfig` reflects the live paddle heights and ball size while a power-up effect is active.

### Power-ups

| Event | Payload | Description |
|-------|---------|-------------|
| `power_up_incoming` | `PendingPowerUp` | A power-up has been chosen and activates by itself at `applyAt` (~2 s warning; nothing needs to be touched to trigger it). |
| `power_up_activated` | `{ type: PowerUpType, side: "left" \| "right" }` | The announced power-up just took effect. `side` is the collector; for `smallPaddle` and `freeze` the affected paddle is the other side. |
| `power_up_expired` | `{ type: PowerUpType, side: "left" \| "right" }` | A power-up's effect just ended (after 5 s, or 3 s for `freeze`). `side` is the collector, as in `power_up_activated`. |

### Game end / connection

| Event | Payload | Description |
|-------|---------|-------------|
| `game_over` | `{ winnerSocketId: string, winnerId?: number, winnerUsername: string, scores: { left: number, right: number }, reason?: "disconnect" }` | Game ended, by a normal win or an opponent disconnect. Same shape for both; `reason` is only set for the disconnect case. |
| `player_disconnected` | none | Opponent disconnected; the 15 s grace period started. |
| `player_reconnected` | none | Opponent reconnected; the game resumed. |
| `game_abandoned` | none | You reconnected after a drop, but your match no longer exists (the opponent left with `leave_game`, or the grace period ran out). Reset the game screen. No `game_over` is sent for this. |

### Online

| Event | Payload | Description |
|-------|---------|-------------|
| `online_changed` | `{ userId: number, isOnline: boolean }` | Broadcast to every connected client when a user's online status actually flips (first tab connecting, or last tab disconnecting). Not sent on every connect/disconnect, only on a real transition. |

### Rematch

| Event | Payload | Description |
|-------|---------|-------------|
| `rematch_requested` | none | Opponent wants a rematch. |
| `rematch_accepted` | none | Opponent accepted your rematch request; `match_found` follows right after. |
| `rematch_declined` | none | The rematch can't happen: the opponent declined it, left the result screen, disconnected, or is already in another match (or you are, or your socket isn't in that match anymore). Also sent to you if the opponent asked for a rematch and then left, so close any open rematch request popup. |
| `rematch_failed` | none | Both players requested a rematch, but the other one disconnected before the new match could start. |

### Invites

| Event | Payload | Description |
|-------|---------|-------------|
| `invite_received` | `{ fromUserId: number, fromUsername: string, fromAvatarUrl: string \| null, winningScore: number }` | A friend invited you to play, to `winningScore` points. `fromAvatarUrl` is the inviter's avatar from when their socket connected, so it can be outdated if they changed it since. |
| `invite_cancelled` | `{ fromUserId: number }` | The invite from `fromUserId` was cancelled (they cancelled it, it timed out, they disconnected, or a match started for you or for them, for example from matchmaking). Close the invite popup. |
| `invite_declined` | `{ friendId: number }` | `friendId` declined your invite (or disconnected before responding). |
| `invite_timeout` | `{ friendId: number }` | `friendId` didn't respond within 30 s. |
| `invite_error` | `{ message: string }` | Your `invite_friend` request couldn't be sent, or an invite you accepted with `invite_response` can't start because the inviter left, one of you is already in a game, or the invite was cancelled just before you accepted it (see `message`). Also sent to the inviter when the invited friend starts another match before answering ("Your friend started another game."). Never sent to a player who is in a running match. |

### Messages

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `{ id, createdAt, content, senderId, receiverId, sender: { id, username, avatarUrl } }` | Pushed to the recipient's connected socket(s) right after `POST /messages` saves it. Not sent if the recipient is offline (they get it from `GET /messages/:friendId` on next load). |

---

## Types

```ts
type PowerUpType = "bigPaddle" | "smallPaddle" | "freeze" | "smallBall" | "paddleSpeedBoost";

type PendingPowerUp = {
  type: PowerUpType;
  side: "left" | "right"; // the collector
  applyAt: number;        // timestamp (ms) when it activates
};

// max scores allowed in invite_friend (shared/game_types.ts)
const WINNING_SCORE_OPTIONS = [3, 5, 7, 11];
```

`bigPaddle`, `smallBall` and `paddleSpeedBoost` buff the collector; `smallPaddle` and `freeze` debuff the opponent instead.
