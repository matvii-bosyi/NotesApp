# NotesApp Server

## Опис

Це серверна частина для додатку "NotesApp", створена на фреймворку **NestJS**. Сервер надає REST API для керування нотатками, реалізує автентифікацію користувачів за допомогою JWT та взаємодіє з базою даних PostgreSQL через Prisma ORM.

## Основні можливості

*   **Автентифікація:** Реєстрація та вхід користувачів за допомогою JWT (JSON Web Tokens).
*   **CRUD для нотаток:** Повний набір операцій (Create, Read, Update, Delete) для керування нотатками.
*   **Прив'язка нотаток до користувача:** Кожен користувач має доступ тільки до власних нотаток.
*   **Валідація даних:** Використання вбудованих у NestJS `Pipes` та `class-validator` для перевірки вхідних даних.
*   **Типізація:** Проект повністю написаний на **TypeScript**.

## Стек технологій

*   **Фреймворк:** [NestJS](https://nestjs.com/)
*   **Мова:** [TypeScript](https://www.typescriptlang.org/)
*   **База даних:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Автентифікація:** [Passport.js](http://www.passportjs.org/) (стратегії `passport-jwt`)
*   **Валідація:** `class-validator`, `class-transformer`
*   **Тестування:** [Jest](https://jestjs.io/) для unit- та e2e-тестів.
*   **Линтинг та форматування:** ESLint та Prettier.

---

## Початок роботи

### Вимоги

*   [Node.js](https://nodejs.org/en/) (рекомендована версія LTS)
*   [PostgreSQL](https://www.postgresql.org/download/) запущений локально або в Docker.

### 1. Встановлення

```bash
# Перейдіть у директорію сервера
cd server

# Встановіть залежності
npm install
```

### 2. Налаштування середовища

Створіть файл `.env` у корені директорії `server/` за прикладом файлу `.env.example`.

**.env.example**
```env
# ------------------
# DATABASE
# ------------------
# URL для підключення до вашої PostgreSQL бази даних
# Формат: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:password@localhost:5432/notesapp?schema=public"

# ------------------
# JWT
# ------------------
# Секретний ключ для підпису JWT токенів.
# Замініть на свій власний довгий та складний рядок!
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
```

### 3. Міграції бази даних

Після налаштування `DATABASE_URL` застосуйте Prisma-міграції, щоб створити необхідні таблиці в базі даних.

```bash
npx prisma migrate dev --name init
```

### 4. Запуск додатку

```bash
# Запуск у режимі розробки (з автоматичним перезапуском)
npm run start:dev

# Запуск у production режимі
npm run start:prod
```

Сервер буде запущено за адресою `http://localhost:3000`.

## Тестування

```bash
# Запуск unit-тестів
npm run test

# Запуск end-to-end тестів
npm run test:e2e
```

## API Ендпоінти

### Auth

*   `POST /auth/register` - Реєстрація нового користувача.
*   `POST /auth/login` - Вхід користувача та отримання JWT токена.

### Notes (Захищені)

*   `GET /notes` - Отримати всі нотатки поточного користувача.
*   `GET /notes/:id` - Отримати конкретну нотатку за її ID.
*   `POST /notes` - Створити нову нотатку.
*   `PATCH /notes/:id` - Оновити існуючу нотатку.
*   `DELETE /notes/:id` - Видалити нотатку.

---