## HackernewsClone Backend

This is an express server which implements authentication, and an api to interact with the database which contains posts, comments, and scores.

## Production

1. Build Dockerfile
docker build -t local/ts-node-postgres-auth .

2. docker-compose up

## Dev

1. docker-compose -f docker-compose.dev.yml

2. npm run dev
