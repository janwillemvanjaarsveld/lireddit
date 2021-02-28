import 'reflect-metadata';
import 'dotenv-safe/config';
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { Post } from './entities/Post';
import { User } from './entities/User';
import path from 'path';
import { Updoot } from './entities/Updoot';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: false,
        synchronize: false, // handles the creation of new table
        migrations: [path.join(__dirname, './migrations', '*')],
        entities: [Post, User, Updoot],
    });
    await conn.runMigrations();

    // delete all posts
    // await Post.delete({});

    const app = express();

    let RedisStore = connectRedis(session);
    let redis = new Redis(process.env.REDIS_URL);
    app.set('trust proxy', 1);

    app.use(
        cors({
            credentials: true,
            origin: process.env.CORS_ORIGIN,
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie only works in https

                // if errors with cookies
                // domain: __prod__ ? '.domain.com' : undefined
            },
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader(),
        }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    const port = parseInt(process.env.PORT) || 4000;

    app.listen(port, () => {
        console.log(`server started on localhost:${port}`);
    });
};

main();
