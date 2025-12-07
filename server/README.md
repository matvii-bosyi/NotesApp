# NotesApp Server

## Description

This is the backend for the "NotesApp" application, built with the **NestJS** framework. The server provides a REST API for managing notes, implements user authentication using JWT, and interacts with a PostgreSQL database via the Prisma ORM.

## Key Features

*   **Authentication:** User registration and login using JWT (JSON Web Tokens) with access and refresh tokens.
*   **CRUD for Notes:** A complete set of operations (Create, Read, Update, Delete) for managing notes.
*   **CRUD for Tags:** Operations for managing tags associated with notes.
*   **User-Note Association:** Each user can only access their own notes and tags.
*   **Data Validation:** Uses built-in NestJS `Pipes` and `class-validator` for input data validation.
*   **Typing:** The project is written entirely in **TypeScript**.

## Technology Stack

*   **Framework:** [NestJS](https://nestjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** [Passport.js](http://www.passportjs.org/) (`passport-jwt` strategies)
*   **Validation:** `class-validator`, `class-transformer`
*   **Testing:** [Jest](https://jestjs.io/) for unit and e2e tests.
*   **Linting & Formatting:** ESLint and Prettier.

---

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [PostgreSQL](https://www.postgresql.org/download/) running locally or in Docker.

### 1. Installation

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server/` root directory. You can use the `.env.example` as a template.

**.env.example**
```env
# ------------------
# DATABASE
# ------------------
# Connection URL for your PostgreSQL database
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/notesapp?schema=public"

# ------------------
# JWT
# ------------------
# Secret key for signing JWT access tokens.
# Replace with your own long and complex string!
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
JWT_EXPIRES="15m"

# Secret key for signing JWT refresh tokens.
JWT_REFRESH_SECRET="YOUR_OTHER_SUPER_SECRET_KEY"
JWT_REFRESH_EXPIRES="7d"

# ------------------
# COOKIE
# ------------------
# Domain for setting the refresh token cookie
COOKIE_DOMAIN="localhost"
```

### 3. Database Migrations

After configuring the `DATABASE_URL`, apply the Prisma migrations to create the necessary tables in your database.

```bash
npx prisma migrate dev
```

### 4. Running the Application

```bash
# Start in development mode (with auto-reloading)
npm run start:dev

# Start in production mode
npm run start
```

The server will start at `http://localhost:3000`.

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e
```

## API Endpoints

### Auth

*   `POST /auth/register` - Register a new user.
*   `POST /auth/login` - Log in a user and get JWT tokens.
*   `POST /auth/refresh` - Refresh access token using a refresh token.
*   `POST /auth/logout` - Log out a user.
*   `GET /auth/me` - Get the current user's profile.

### Notes (Protected)

*   `GET /notes` - Get all notes for the current user.
*   `GET /notes/:id` - Get a specific note by its ID.
*   `POST /notes` - Create a new note.
*   `PATCH /notes/:id` - Update an existing note.
*   `DELETE /notes/:id` - Delete a note.

### Tags (Protected)

*   `GET /tags` - Get all tags for the current user.
*   `GET /tags/:id` - Get a specific tag by its ID.
*   `POST /tags` - Create a new tag.
*   `PATCH /tags/:id` - Update an existing tag.
*   `DELETE /tags/:id` - Delete a tag.

---
