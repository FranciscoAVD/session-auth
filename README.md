# Boilerplate Session authentication with email verification

## Requirements
- Docker desktop
- package manager (npm, pnpm, bun)

### Set up
1. `npm install`
2. `docker compose up`
3. `npm run db:push`
4. `npm run db:studio` (Can visually verify that the schema was successfully created)
5. `npm run dev`

### TODO
- Update session and cookie expiration when within a certain threshold to the expiration date
- Implement salting and verifying passwords with argon
- Add email verification
- 

### Notes
- Postgres timestamps are in microseconds. `new Date(Date.now())` returns the date in milliseconds.