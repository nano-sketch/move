import { MongoClient } from "mongodb";
import type { Document } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

if (!MONGODB_URI) throw new Error("MONGODB_URI is null");

export interface User {
    username: string;
    progress: number;
    completed: number[];
    completedchallenges?: number[];
    solutionshallf?: number[];
    createdAt?: Date;
}

/* SO the connection complies with vercel..*/
let cached_client: MongoClient | null = null;
let cached_promise: Promise<MongoClient> | null = null;

async function connect(): Promise<MongoClient> {
    if (cached_client) return cached_client;
    if (cached_promise) return cached_promise;

    const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        maxIdleTimeMS: 10000 /* Close idle sockets before freeze */,
        maxPoolSize: 1,
    });

    cached_promise = client
        .connect()
        .then((cl) => {
            cached_client = cl;
            cached_promise = null;
            return cached_client;
        })
        .catch((err) => {
            cached_promise = null;
            throw err;
        });

    return cached_promise;
}

export async function get_database(db: string = "data") {
    const client = await connect();
    return client.db(db);
}

export async function get_collection<T extends Document>(
    coll_name: string,
    db_name: string = "data",
) {
    const db = await get_database(db_name);
    return db.collection<T>(coll_name);
}

export async function get_user(username: string): Promise<User | null> {
    const users = await get_collection<User>("users");
    return await users.findOne({ username });
}
