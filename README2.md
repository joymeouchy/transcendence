*This project has been created as part of the 42 curriculum by jmeouchy and rdennaou.*

# fPONG_XP

## Description

### Project Name


//TODO: for rawan add the pitch from the uni project
**ft_transcendence** is a full-stack web application built as part of the 42 curriculum. The project is centered around a real-time multiplayer version of the classic Pong game, combined with social features and a complete user experience.

The main goal is to build a web application where users can create accounts, manage their profiles and friends, invite other users to games, participate in real-time Pong matches, and review their game statistics.

The application is designed as a modern single-page web experience with a separate frontend and backend communicating through HTTPS APIs and WebSockets.

### Key Features

- User registration, login, logout, and authentication.
- User profiles with avatars and game statistics.
- Friend management and online/offline status.
- Real-time friend-to-friend game invitations.
- Invitation acceptance, rejection, cancellation, and timeout handling.
- Matchmaking and waiting states.
- Real-time multiplayer Pong.
- Real-time chat Socket.IO.
- Handling of player disconnections during matches. //TODO maybe
- Match results and game history.
- Leaderboard based on player statistics.
- Game customization and selectable visual themes.
- Game sound effects.
- Responsive user interface.
- XP-inspired desktop and modal interface.
- PostgreSQL database managed through Prisma.
- Docker-based development environment.

---

# Team Information

> Replace the placeholder logins and role assignments below with the exact team information before submission.

//TODO: figure out this

| Member | Role(s) | Responsibilities |
|---|---|---|
| `<login1>` | Project Manager / Developer | Project coordination, task organization, feature implementation, frontend/backend integration, testing, and documentation. |
| `<login2>` | Developer / Tech Lead | Backend architecture, database integration, real-time server functionality, API implementation, and technical decisions. |

### Roles

# Project Management

## Work Organization

The project was divided into frontend, backend, database, real-time communication, and integration tasks.

Tasks were broken down into smaller features so that team members could work independently where possible and then integrate their work through Git.

The main development workflow was:

1. Define the feature or task.
2. Create or assign a task.
3. Implement the feature in an isolated branch when appropriate.
4. Test the implementation locally.
5. Integrate the changes with the main development branch.
6. Test the integrated application.
7. Fix integration or regression issues.

Because the project contains real-time functionality, frontend and backend work sometimes had to be coordinated closely. Socket events, payloads, authentication state, and database models needed to remain consistent between both sides.

## Project Management Tools

- **GitHub** — source control, collaboration, issues, and project tracking.
- **Git** — version control and branch-based development.
- **Whatsapp** — team communication and coordination.
- **todo list in this repo** — task planning and tracking. //TODO fix wording

## Communication

The team used online communication to discuss implementation decisions, coordinate work, report progress, and resolve integration problems.

Regular communication was especially important when working on features involving both the frontend and backend, such as authentication, friends, invitations, matchmaking, and real-time games.

---

# Technical Stack

## Frontend

### Next.js

The frontend is built with **Next.js** and **React**.

Next.js provides the application structure, routing, client/server component architecture, and development tooling.

### React

React is used to build the application's reusable UI components and manage interactive client-side state.

### TypeScript

TypeScript is used throughout the frontend to provide static typing for components, application state, API data, socket events, and shared data structures.

### SCSS / CSS Modules

SCSS and CSS Modules are used for component-specific styling. This keeps styles organized and reduces unintended global CSS conflicts.

---

## Backend

### Node.js

Node.js provides the runtime environment for the backend.

### Express

Express is used to implement the backend HTTP server and API endpoints.

### Socket.IO

Socket.IO provides the real-time communication required for multiplayer games and social interactions.

It is used for functionality such as:

- Player connection status.
- Game invitations.
- Invitation acceptance and rejection.
- Invitation timeout handling.
- Matchmaking.
- Game state communication.
- Player disconnection events.
- Real-time game updates.

---

## Database

### PostgreSQL

The project uses **PostgreSQL** as its relational database.

A relational database was chosen because the application contains structured relationships between users, friendships, games, and game statistics. PostgreSQL provides strong relational integrity and is well suited to querying this type of data.

### Prisma

**Prisma ORM** is used to communicate with PostgreSQL from the backend.

Prisma provides:

- Type-safe database queries.
- Schema management.
- Database migrations.
- Relationships between models.
- A generated TypeScript client.

### Supabase

Supabase is used as the PostgreSQL database infrastructure for development/deployment where applicable.

---

## Docker

Docker is used to provide a consistent development environment and simplify running the different services required by the application.

---

# Technical Architecture //TODO check this chart

The application is divided into several logical layers:

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │                     │
                    │ Next.js / React /   │
                    │ TypeScript / SCSS   │
                    └──────────┬──────────┘
                               │
                    HTTP / WebSocket
                               │
                 ┌─────────────▼─────────────┐
                 │          Backend          │
                 │                           │
                 │ Node.js / Express /       │
                 │ Socket.IO                 │
                 └─────────────┬─────────────┘
                               │
                         Prisma ORM
                               │
                 ┌─────────────▼─────────────┐
                 │       PostgreSQL          │
                 │                           │
                 │ Users / Friends / Games / │
                 │ Statistics / Sessions     │
                 └───────────────────────────┘
```

---

# Database Schema

The database uses PostgreSQL with Prisma ORM.

The exact schema should be kept synchronized with `prisma/schema.prisma`. 
//TODO add a photo of the schema

---

# Features List //change this to reflect enno 1 was backend one was frontend w add the backend work. since he l gpt taba3e ma 3endo access 3al backend side so fi eshya ma zedun i guess metel l google auth

| Feature | Description | Contributor(s) |
|---|---|---|
| Authentication | Registration, login, logout, and authenticated user state. | `<member>` |
| User Profiles | Display and manage user information and game statistics. | `<member>` |
| Friends | Add, remove, view, and track friends. | `<member>` |
| Online Status | Display whether users are currently connected. | `<member>` |
| Game Invitations | Invite an available friend to a Pong match. | `<member>` |
| Invitation Acceptance | Accept an incoming game invitation and start the match flow. | `<member>` |
| Invitation Rejection | Reject an incoming invitation and notify the sender. | `<member>` |
| Invitation Timeout | Handle invitations that are not answered within the allowed time. | `<member>` |
| Invitation Cancellation | Allow the sender to cancel a pending invitation. | `<member>` |
| Matchmaking | Put players through the appropriate waiting/matching states before a game starts. | `<member>` |
| Real-Time Pong | Multiplayer Pong using real-time communication. | `<member>` |
| Player Disconnect Handling | Detect and handle a player leaving an active match. | `<member>` |
| Match Results | Display the result after a match ends. | `<member>` |
| Match History | Display previous matches and results. | `<member>` |
| Leaderboard | Display players according to their game statistics. | `<member>` |
| Game Customization | Allow players to customize the game interface/theme. | `<member>` |
| Sound Effects | Provide audio feedback for game events and UI interactions. | `<member>` |
| Responsive UI | Adapt the interface to different screen sizes. | `<member>` |

---

# Game Flow

A typical friend-invitation game follows this flow:

```text
Player A
   │
   │ Invite Player B
   ▼
Pending Invitation
   │
   ├───────────────┐
   │               │
Accept          Reject / Timeout
   │               │
   ▼               ▼
Matchmaking     Invitation Ended
   │
   ▼
Waiting for Players
   │
   ▼
Pong Match
   │
   ├──── Player disconnects
   │
   └──── Match finishes
              │
              ▼
         Match Result
              │
              ▼
        Match History
```

The application also prevents users who are already participating in an active game from being treated as available opponents.

---

# Modules
 //TODO add description

## Major Modules — 2 points each

### Major Module 1: Use a framework for both the frontend and backend.
◦ Use a frontend framework (React).
◦ Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails, etc.).
◦ Full-stack frameworks (Next.js) count as both if you use both their frontend and backend capabilities.

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---

###  Major Module 2: Implement real-time features using WebSockets or similar technology.
◦ Real-time updates across clients.
◦ Handle connection/disconnection gracefully.
◦ Efficient message broadcasting.

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---

###  Major Module 3: Allow users to interact with other users. The minimum requirements are:
◦ A basic chat system (send/receive messages between users).
◦ A profile system (view user information).
◦ A friends system (add/remove friends, see friends list).

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---


### Major Module 4: Standard user management and authentication.
◦ Users can update their profile information.
Surprise.
◦ Users can upload an avatar (with a default avatar if none provided).
◦ Users can add other users as friends and see their online status.
◦ Users have a profile page displaying their information.

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---

### Major Module 5: Implement a complete web-based game where users can play against each other.
◦ The game can be real-time multiplayer (e.g., Pong, Chess, Tic-Tac-Toe, Card games, etc.).
◦ Players must be able to play live matches.
◦ The game must have clear rules and win/loss conditions.
◦ The game can be 2D or 3D.

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---

### Major Module 6: Remote players — Enable two players on separate computers to play the same game in real-time.
◦ Handle network latency and disconnections gracefully.
◦ Provide a smooth user experience for remote gameplay.
◦ Implement reconnection logic.

**Points:** 2

**Justification:**

This module was selected because it adds a significant technical component to the application and directly supports the project's functionality.

**Implementation:**

Describe the architecture, libraries, APIs, and components used to implement the module.

**Contributors:**

- `jmeouchy and rdennaou`

---

## Minor Modules — 1 point each

### Minor Module 1: Use an ORM for the database.

**Points:** 1

**Justification:**

Describe why this module was selected.

**Implementation:**

Describe how it was implemented.

**Contributors:**

- `rdennaou`

---

### Minor Module 2: Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components).

**Points:** 1

**Justification:**

Describe why this module was selected.

**Implementation:**

Describe how it was implemented.

**Contributors:**

- `jmeouchy`

---

### Minor Module 3: Game statistics and match history (requires a game module).
◦ Track user game statistics (wins, losses, ranking, level, etc.).
◦ Display match history (1v1 games, dates, results, opponents).
◦ Show achievements and progression.
◦ Leaderboard integration.

**Points:** 1

**Justification:**

Describe why this module was selected.

**Implementation:**

Describe how it was implemented.

**Contributors:**

- `jmeouchy and rdennaou`

---

### Minor Module 4: Implement remote authentication with OAuth 2.0 (Google, GitHub, 42, etc.).

**Points:** 1

**Justification:**

Describe why this module was selected.

**Implementation:**

Describe how it was implemented.

**Contributors:**

- `rdennaou`

---

### Minor Module 5: Game customization options.
◦ Power-ups, attacks, or special abilities
◦ Different maps or themes.
◦ Customizable game settings.
◦ Default options must be available.

**Points:** 1

**Justification:**

Describe why this module was selected.

**Implementation:**

Describe how it was implemented.

**Contributors:**

- `jmeouchy and rdennaou`

---

Major modules tota: 12 pts;
Minor modules total: 5 pts;

Points total: 17 pts

---

# Individual Contributions

## `<login1>`

### Responsibilities

- Frontend development.
- User interface implementation.
- Real-time game interface.
- Game invitation and matchmaking flows.
- Integration with backend APIs and Socket.IO.
- UI state management.
- Testing and debugging.
- Project documentation.

### Specific Contributions

#### Game Interface

Implemented the user-facing game experience, including:

- Game selection.
- Matchmaking states.
- Waiting states.
- Active game interface.
- Game result states.
- Opponent disconnect handling.

#### Game Invitations

Implemented the frontend invitation flow, including:

- Sending invitations.
- Receiving invitations.
- Accepting invitations.
- Rejecting invitations.
- Cancelling invitations.
- Invitation timeouts.
- Invitation-related modal states.
- Handling invitations outside the game page through global socket listeners.

#### Friends and Online Status

Integrated friend information with the game system and handled online/offline state changes.

#### Game Statistics

Implemented the frontend presentation of:

- Match history.
- Leaderboard.
- Player statistics.

#### UI / UX

Worked on the visual design and responsive behavior of the application, including the XP-inspired interface, game themes, modals, sounds, and responsive layouts.

### Challenges

A major challenge was coordinating real-time state between the frontend and backend. A single user action can produce several asynchronous events, so the frontend needed to correctly handle socket events, modal states, matchmaking states, and navigation without leaving stale state behind.

Another challenge was handling invitations when the recipient is not currently on the game page. This required separating invitation socket handling from page-specific game components so that incoming invitations could be processed globally.

---

## `<login2>` //TODO add your contributions

### Responsibilities

- Backend development.
- Database design.
- API implementation.
- Socket.IO server logic.
- Authentication/backend integration.
- Match management.
- Testing and debugging.

### Specific Contributions

Document the backend features implemented by this team member, including the relevant APIs, database models, socket events, and game logic.

### Challenges

Document the major backend/database challenges encountered and how they were resolved.

---

# Installation & Instructions //TODO depending on whether we host or not we fix this section

## Prerequisites

Install the following before running the project:

- Git
- Node.js
- npm
- Docker and Docker Compose
- PostgreSQL-compatible database / Supabase project
- A modern web browser

Check your installed versions:

```bash
node --version
npm --version
docker --version
docker compose version
```

The project currently uses:

```text
Next.js 16.2.6
React 19.2.4
Prisma 6.19.3
TypeScript
Node.js
Express
Socket.IO
PostgreSQL
Docker
```

> Keep these versions synchronized with the actual `package.json` and project configuration before submission.

---

## Clone the Repository

```bash
git clone <repository-url>
cd transcendence
```

---

## Environment Variables

Create the required environment files before starting the application.

For example:

```env
DATABASE_URL=your_database_connection_string
DIRECT_URL=your_direct_database_connection_string
FRONTEND_URL=https://localhost
BACKEND_URL=https://localhost/api
NEXT_PUBLIC_API_URL=https://localhost/api
NEXT_PUBLIC_SOCKET_URL=https://localhost
```

Additional authentication or Supabase variables may be required depending on the final project configuration.

**Do not commit `.env` files or private credentials to Git.**

---

## Install Dependencies

Install the frontend/backend dependencies according to the project's package structure.

For a single package:

```bash
npm install
```

If frontend and backend have separate package files:

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the database schema/migrations:

```bash
npx prisma migrate dev
```

If the project uses a different migration workflow, follow the commands defined in the repository's Prisma configuration.

---

## Run the Application

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
npm run dev
```

The development application uses:

```text
Frontend: https://localhost
Backend:  https://localhost/api
Sockets:  wss://localhost/socket.io
(all served through the Caddy reverse proxy, see Caddyfile)
```

The exact commands may differ depending on the final repository scripts.

---

## Docker

If using the project's Docker configuration:

```bash
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

---

# Usage

1. Open the application in a browser.
2. Create an account or log in.
3. Open the profile/friends section.
4. Add friends.
5. When a friend is online and available, send a game invitation.
6. The invited player can accept or reject the invitation.
7. Accepted invitations enter the matchmaking/waiting flow.
8. Once both players are ready, the Pong match starts.
9. Play the match in real time.
10. When the match ends, the result is recorded.
11. View the result, match history, and leaderboard.

---

# Real-Time Communication

Socket.IO is used for real-time events.

Examples of real-time interactions include:

```text
User connection
      │
      ▼
Online status
      │
      ├── Game invitation
      │
      ├── Invitation accepted
      │
      ├── Invitation rejected
      │
      ├── Invitation timeout
      │
      ├── Matchmaking
      │
      ├── Game state
      │
      └── Opponent disconnected
```

The frontend registers listeners for relevant events and updates React state based on server messages.

Care is taken to clean up socket listeners when components unmount to avoid duplicate event handlers and stale state.

---

# Security and Validation

The application should validate user input and server-side requests rather than relying exclusively on frontend validation.

Sensitive configuration such as database credentials and authentication secrets is stored in environment variables.

Private credentials and `.env` files must not be committed to the repository.

---

# Testing

Testing was performed during development through:

- Manual browser testing.
- Testing multiple users simultaneously.
- Testing invitation acceptance/rejection.
- Testing invitation timeout behavior.
- Testing player disconnections.
- Testing online/offline status.
- Testing database interactions.
- Testing frontend/backend integration.
- Testing different UI states and screen sizes.

Real-time functionality was tested using multiple browser sessions/users to reproduce interactions between players.

---

# Resources

## Official Documentation

- Next.js Documentation  
  https://nextjs.org/docs

- React Documentation  
  https://react.dev/

- TypeScript Documentation  
  https://www.typescriptlang.org/docs/

- Node.js Documentation  
  https://nodejs.org/docs/latest/

- Express Documentation  
  https://expressjs.com/

- Socket.IO Documentation  
  https://socket.io/docs/v4/

- Prisma Documentation  
  https://www.prisma.io/docs

- PostgreSQL Documentation  
  https://www.postgresql.org/docs/

- Docker Documentation  
  https://docs.docker.com/

- Supabase Documentation  
  https://supabase.com/docs

## Game / Networking References

The team consulted documentation and tutorials related to:

- Real-time client/server communication.
- WebSocket concepts.
- Socket.IO event handling.
- Multiplayer game state synchronization.
- Pong game mechanics.
- React state management.
- Next.js application architecture.
- PostgreSQL relational database design.

Specific external tutorials and articles used by the team should be added here before submission.

---

# AI Usage

AI tools were used as development assistance throughout the project.

AI assistance was used for:

- Explaining unfamiliar programming concepts.
- Debugging TypeScript and React errors.
- Troubleshooting Next.js issues.
- Reviewing component and state-management approaches.
- Debugging Socket.IO event handling.
- Reasoning about real-time invitation and matchmaking flows.
- Identifying potential state-management and event-listener issues.
- Suggesting code organization and refactoring approaches.
- Improving documentation and README structure.
- Helping understand errors produced by the compiler and development environment.

For the frontend game system specifically, AI assistance was used while debugging and reasoning about:

- Game invitation listeners.
- Invitation acceptance/rejection.
- Invitation timeout handling.
- Modal state transitions.
- Matchmaking states.
- Opponent disconnection handling.
- Global invitation notifications.
- Preventing users already in a game from receiving additional game invitations.
- React and Socket.IO lifecycle issues.

AI-generated suggestions were treated as development assistance rather than authoritative solutions. Code was reviewed, adapted, tested, and integrated by the team. The team remained responsible for the final implementation and behavior of the application.

---

# Known Limitations

- The application requires the backend and database services to be available for full functionality.
- Real-time features depend on a stable network connection.
- Game invitation availability depends on the target user being online and not already participating in a match.
- Some UI behavior may depend on the current browser and viewport size.
- The final production deployment configuration may differ from the local development configuration.

Additional known limitations should be documented here if identified during final testing.

---

# Development Notes

The project uses a separation between:

```text
Frontend
   ↓
HTTP API / Socket.IO
   ↓
Backend
   ↓
Prisma
   ↓
PostgreSQL
```

This separation allows the user interface, application logic, real-time communication, and persistence layer to evolve independently while communicating through defined interfaces.

---

# Credits

Developed as part of the **42 ft_transcendence** curriculum.

Team members:

- `jmeouchy`
- `rdennaou`

---

# License

This project was created for educational purposes as part of the 42 curriculum.
