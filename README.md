# TaskFlow – Student Task Manager

TaskFlow is a responsive student productivity app created for a Software Design & Architecture lab assignment. It demonstrates **Layered Architecture** by keeping the presentation, business logic, and data access responsibilities independent.

## Features

- Add tasks with title, description, priority, and due date
- Mark tasks complete or pending
- Delete tasks with confirmation
- Search and filter tasks
- Task statistics dashboard
- Persistent browser localStorage storage
- Friendly empty states and responsive layout
- In-app architecture explainer

## Architecture used

The dependency direction is:

`Presentation → Business Logic → Data Access → localStorage`

- **Presentation Layer:** React components handle UI and user interaction.
- **Business Logic Layer:** `taskService.ts` validates input, creates and updates tasks, filters results, and calculates statistics.
- **Data Access Layer:** `taskRepository.ts` is the only layer that reads and writes browser localStorage.

## Project structure

```text
app/
  page.tsx                 Presentation entry point
  globals.css
business/
  taskService.ts           Business rules and task operations
data/
  taskRepository.ts        localStorage persistence
```

## Technologies used

Next.js, React, TypeScript, Tailwind CSS, Lucide React, and browser localStorage.

## How to run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in a browser. For a production check, use `pnpm build`.

## Architecture flow

The UI calls the business service. The service applies rules and delegates persistence to the repository. The repository communicates with localStorage.

## Screenshots

_Add screenshots of the dashboard here for submission documentation._
