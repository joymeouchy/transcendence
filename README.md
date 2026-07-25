*TRANSCENDENCE*
-------------
Frontend: Next.js + React (UI)
Backend: Node.js + Typescript
Frontend Framework: SCSS
Backend Framework: Express
Database: Supabase
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
