if (process.env.NODE_ENV === "dev") require("dotenv").config();
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { errorMiddleware } from "./api/middleware/error";
import { apiRouter } from "./api";
import {
  createUsersTable,
  createPostsTable,
  createCommentsTable,
  createPostVotesTable,
  createCommentVotesTable,
} from "./db";

(async () => {
  //Wait for db and redis to start
  await new Promise((res) =>
    setTimeout(res, process.env.NODE_ENV === "production" ? 5000 : 500)
  );

  const app = express();

  app.use(function(_req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', "true");
    return next();
  });

  const RedisStore = connectRedis(session);

  const client = new Redis({
    port: 6379,
    host: process.env.NODE_ENV === "production" ? "redis" : "localhost",
    password: process.env.REDIS_SECRET,
  });

  app.use(express.json());

  app.use(
    session({
      store: new RedisStore({ client }),
      secret: process.env.COOKIE_SECRET!,
      proxy: true,
      name: "sid",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, sameSite:'lax', httpOnly: true, maxAge: 1000 * 60 * 60 * 7 },
    })
  );

  app.use((req, _res, next) => {
    console.log("-------");
    console.log(req.headers);
    console.log(req.body);
    console.log(req.path)
    console.log("-------");
    next();
  });

  app.use("/api", apiRouter);

  app.use(errorMiddleware);

  try {
    await createUsersTable();

    await createPostsTable();

    await createCommentsTable();

    await createPostVotesTable();

    await createCommentVotesTable();
  } catch (err) {
    console.log(err);
  }

  app.listen(4000, async () => {
    console.log(`Listining on $4000`);
  });
})();
