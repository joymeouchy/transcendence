*TRANSCENDENCE*
-------------
Frontend: Next.js + React (UI)
Backend: Node.js + Typescript
Frontend Framework: Tailwind CSS
Backend Framework: Express
Database: PostgreSQL
ORM: Prisma
Deployment: Docker Compose
Game Rendering: HTML5 Canvas

*Architecture:*
------------
Next.js for:
   -UI (login, game screen)
   -API calls for backend
   -WebSocket connection
Node.js for:
   -Authentication
   -Scores/ history
   -Game State
   -WebSocketServer

PostgreSQL:
   -User/ Match/ Score/ Status


Backend calculates: 
⦁	ball movement 
⦁	collisions 
⦁	score 

Frontend: 
⦁	sends player input (up/down) 
⦁	renders what backend sends

Note:
    .ts → TypeScript (logic only)
    .tsx → TypeScript + JSX (UI)


just an example of structure:
frontend/
│
├── app/                     # Next.js App Router
│   ├── page.tsx             # Home
│   ├── login/
│   ├── game/
│   │   └── page.tsx         # Game screen
│   └── layout.tsx
│
├── components/
│   ├── ui/                  # buttons, inputs
│   ├── game/
│   │   ├── GameCanvas.tsx   # Canvas wrapper
│   │   ├── GameLoop.ts      # requestAnimationFrame loop
│   │   ├── Renderer.ts      # draw ball, paddles
│   │   └── InputHandler.ts  # keyboard input
│
├── hooks/
│   ├── useSocket.ts         # WebSocket connection
│   └── useGameState.ts      # local game state
│
├── lib/
│   ├── api.ts               # REST calls
│   └── constants.ts
│
├── styles/
│
└── public/

backend/
│
├── src/
│   │
│   ├── server.ts            # entry point
│   ├── app.ts               # express setup
│
│   ├── config/
│   │   ├── env.ts
│   │   └── database.ts
│
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│
│   ├── prisma/
│   │   └── client.ts
│
│   ├── sockets/
│   │   ├── socketServer.ts      # websocket setup
│   │   ├── socketHandler.ts     # message routing
│   │
│   │   └── game/
│   │       ├── GameEngine.ts    # game loop (IMPORTANT)
│   │       ├── GameState.ts
│   │       ├── Matchmaker.ts
│   │       └── Player.ts
│
│   ├── utils/
│   │   └── logger.ts
│
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── package.json
└── tsconfig.json