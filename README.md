# Clueless Interactions

Clueless Interactions is a TypeScript library for tracking and querying user interactions (such as button presses and other events) in your application. It uses Prisma and a PostgreSQL database to store and query event data, including flexible context fields for analytics and filtering.

## Features

- Track custom events with arbitrary context data
- Query events with flexible filters (event name, context fields, date range)
- Create database indexes on context fields for efficient querying
- Built with TypeScript and Prisma ORM

## Installation

```
npm install clueless-interactions
```

## Usage

### 1. Set up your database

This library expects a PostgreSQL database. Configure your database URL and run Prisma migrations as needed.

### 2. Initialize the Tracker

```typescript
import { CluelessInteractionTrackerClient } from "clueless-interactions";

const tracker = new CluelessInteractionTrackerClient(process.env.DATABASE_URL!);
```

### 3. Add an Event

```typescript
await tracker.addEvent("button_click", { buttonId: "save", userId: 123 });
```

### 4. Query Events

```typescript
const events = await tracker.queryEvents(
  {
    event: "button_click",
    from: new Date("2025-07-01"),
    to: new Date(),
    context: [{ contextField: "userId", contextValue: 123 }],
  },
  { order: "desc", limit: 10 }
);
```

### 5. Create Index on Context Field

```typescript
await tracker.createContextIndex("userId");
```

## API

### `addEvent(event: string, context: Record<string, any>): Promise<Event>`

Adds a new event with the given name and context.

### `queryEvents(filters?: EventQueryFilters, options?: EventQueryOptions): Promise<Event[]>`

Query events with optional filters:

- `event`: string or array of event names
- `from`/`to`: date range
- `context`: array of context field filters
- `options`: order (asc/desc), limit

### `createContextIndex(field: string): Promise<void>`

Creates a database index on a context field for faster queries.

## Development

- Database: have a database in your .env
- Build: `npm run build`
- Generate Prisma client: `npm run prisma:generate`
