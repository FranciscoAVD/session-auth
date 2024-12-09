# Boilerplate Session authentication with email verification

## Requirements
- Have docker desktop installed
- Have resend account

### Set up
1. `npm install`
2. `docker compose up`
3. `npm run db:push`
4. `npm run db:studio` (Can visually verify that the schema was successfully created)

### Nuances

- Postgres timestamps are in microseconds. When comparing dates (milliseconds), you have to convert to the same unit