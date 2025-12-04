# GEMINI.md

## Project Overview

This is a full-stack notes application. The front-end is built with React and the back-end is a NestJS server.

The server provides the following features:
- JWT-based authentication
- CRUD operations for managing notes

## Building and Running

The following commands are available in the `server` directory.

### Installation

To install the dependencies, run:
```bash
npm install
```

### Building

To build the application, run:
```bash
npm run build
```

### Running the application

To run the application, use one of the following commands:

- **Development mode:** `npm run start:dev`
- **Production mode:** `npm run start`

The server will start on port 3000 by default. You can change the port by setting the `PORT` environment variable.

### Testing

To run the tests, use one of the following commands:

- **Unit tests:** `npm run test`
- **End-to-end tests:** `npm run test:e2e`

## Development Conventions

### Code Style

This project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for linting.

- To format the code, run: `npm run format`
- To lint the code, run: `npm run lint`

### Git

Before committing, make sure to run the linter and the tests.
